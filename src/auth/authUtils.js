'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')

// service
const KeyTokenService = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}

// create RT, AT and verify
const createTokenPair = async ( payload, publicKey, privateKey ) => {
    try {
        // create access token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        // create refresh token
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        // verify
        JWT.verify( accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('err decode::', err)
            } else {
                console.log('decoded verify success::', decode)
            }
        })

        return { accessToken, refreshToken }
    } catch (e) {
        console.log(`create tokens failed!` + e)
    }
}

// authentication 
const authentication = asyncHandler( async (req, res, next) => {
    /*
        1 - check userId missing
        2 - get accessToken
        3 - verify Token
        4 - check user in db
        5 - check keyStore match with this user
        6 - OK ? return next() : error
    */

    // 1.
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid request!')

    // 2.
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found keyStore!')

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid request!')

    // 3.
    try {
        const decodeUser = JWT.verify( accessToken, keyStore.publicKey )
        if (decodeUser.userId !== userId) throw new AuthFailureError('Invalid UserId')

        req.keyStore = keyStore // day keyStore len req
        return next()
    } catch (err) {
        throw err
    }

})

const authenticationV2 = asyncHandler( async (req, res, next) => {
    /*
        1 - check userId missing
        2 - get accessToken
        3 - verify Token
        4 - check user in db
        5 - check keyStore match with this user
        6 - OK ? return next() : error
    */

    // 1.
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid request!')

    // 2.
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found keyStore!')

    // 3.
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify( refreshToken, keyStore.privateKey )
            if (decodeUser.userId !== userId) throw new AuthFailureError('Invalid UserId')

            req.keyStore = keyStore // day keyStore len req
            req.user = decodeUser   // {userId, email}
            req.refreshToken = refreshToken

            return next()
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid request!')

    try {
        const decodeUser = JWT.verify( accessToken, keyStore.publicKey )
        if (decodeUser.userId !== userId) throw new AuthFailureError('Invalid UserId')

        req.keyStore = keyStore // day keyStore len req
        return next()
    } catch (err) {
        throw err
    }

})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)   
}

module.exports = {
    createTokenPair,
    authentication,
    authenticationV2,
    verifyJWT
} 