'use strict'

const keyTokenModel = require('../models/keyToken.model')
const { Types } = require('mongoose')

class KeyTokenService {
    
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // [level 0]
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey : null

            // [level upgrade]
            const filter = {
                user: userId
            }

            const update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }

            // options: neu k co thi tao moi, neu co thi update
            const options = {
                upsert: true,
                new: true
            }

            const tokens = await keyTokenModel.findOneAndUpdate( filter, update, options )

            return tokens ? tokens.publicKey : null
        } catch (e) {
            return e
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) })
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne( id )
    }   

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static deleteKeyById = async (userId) => {
        return await keyTokenModel.deleteOne({ user: userId })
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken })
    }

}

module.exports =  KeyTokenService

