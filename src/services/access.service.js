'use strict'

const shopModel = require('../models/shop.model')
const crypto = require("node:crypto")
const bcrypt = require('bcrypt')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../middlewares/authUtils')
const { getInfoData } = require('../helpers')
const saltRounds = 10
const { BabRequestError, AuthFailureError, ForbiddenError } = require('../helpers/error.response')

// service
const { findByEmail } = require('./shop.service')

const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',   
    ADMIN: 'ADMIN'
}

class AccessService {

    static handlerRefeshTokenV2 = async ({ keyStore, user, refreshToken }) => {

        const { userId, email } = user
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Access denied: something wrong, pls re-login !')
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not register!')

        const foundShop = await findByEmail( {email} ) 
        if (!foundShop) throw new AuthFailureError('Shop not register!')
        // create new tokens
        const tokens = await createTokenPair({ userId: foundShop._id, email }, keyStore.publicKey, keyStore.privateKey)
        // update new tokens
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // tokenUsed add
            }
        })

        return {
            user,
            tokens
        }
    }

    /*
        1 - check token used (if available throw new error)
        2 - check token exist
        3 - check user, shop register
        4 - create new tokens, save refreshToken used
    */
    static handlerRefeshToken = async (refreshToken) => {
        // 1.
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken) 
        if (foundToken) {
            // decoded xem la ai dung refeshToken
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({ userId, email })
            // del keyToken
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Access denied: something wrong, pls re-login !')
        }

        // 2.
        const holderToken = await KeyTokenService.findByRefreshToken( refreshToken )
        if (!holderToken) throw new AuthFailureError('Shop not register! aa')

        // 3.
        // verifyToken
        console.log('holderToken:::', holderToken)
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2]--', { userId, email })
        // check userId
        const foundShop = await findByEmail( {email} ) 
        if (!foundShop) throw new AuthFailureError('Shop not register!')

        // 4.
        // create new tokens
        const tokens = await createTokenPair({ userId: foundShop._id, email }, holderToken.publicKey, holderToken.privateKey)
        // update new tokens
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // tokenUsed add
            }
        })

        return {
            user: {userId, email},
            tokens
        }
    }
    
    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log('delKey::', delKey)
        return delKey;
    }

    static login = async ({ email, password, refreshToken = null }) => {

        // 1 - check email in dbs
        const foundShop = await findByEmail({ email: email })
        console.log('found shop::', foundShop)
        if (!foundShop) throw new BabRequestError('Error: shop is not registered!')
        
        // 2 - match password
        const matchPassword = bcrypt.compare(password, foundShop.password)
        if (!matchPassword) throw new AuthFailureError('Error: password is incorrect!')

        // 3 - create AT, RT and save
        // Create publicKey privateKey using crypto (node v19) 
        const publicKey  = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')

        // 4 - genarate tokens
        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({ 
            userId: foundShop._id, publicKey, privateKey, refreshToken: tokens.refreshToken
        })

        // 5. get data return login
        return {
            // shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop}), // lodash package npm
            shop: {
                id: foundShop._id,
                name: foundShop.name,
                email: foundShop.email,
                // object: foundShop
            },
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        // step 1 : check email exist
        const hodelShop = await shopModel.findOne({ email: email }).lean()
        
        if (hodelShop) {
            throw new BabRequestError('Error: Shop already registered!')
        }
        
        // hash password, create shop
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })
        
        if (newShop) {
            // Create publicKey privateKey using crypto (node v19) 
            const publicKey  = crypto.randomBytes(64).toString('hex')
            const privateKey = crypto.randomBytes(64).toString('hex')

            console.log(privateKey, publicKey)  

            // save publicKey, privateKey
            const keyStore = await KeyTokenService.createKeyToken({   
                userId : newShop._id,
                publicKey,
                privateKey
            })

            if (!keyStore) {
                throw new BabRequestError('Error: Key store error!')
            }

            // create access token, refresh token
            const tokens = await createTokenPair({ userId : newShop._id, email }, publicKey, privateKey)
            console.log(`Tokens::`, tokens)

            return {
                code: 201,
                metadata: {
                    // shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop}), // lodash package npm
                    shop: {
                        id: newShop._id,
                        name: newShop.name,
                        email: newShop.email
                    },
                    tokens
                }
            }  
        }
        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService