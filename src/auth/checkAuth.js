'use strict'

const { findById } = require('../services/apiKey.service')

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

// check api key middleware
const apiKey = async (req, res, next) => {
    try {
        // check key in header req
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden error!'
            })
        }

        // check object key in db
        const objKey = await findById(key)
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden error!'
            })
        } 
        req.objKey = objKey // add key:value pair to an obj
        return next()

    } catch (e) {
        console.log(e)
    }
}

// check permissions middleware
const permissions = ( permissions ) => {
    return (req, res, next) => {
        // check exist
        if (!req.objKey.permissions) {
            return res.status(403).json({ 
                message: 'Permission denied!'
            })
        }

        // check valid
        const validPermissions = req.objKey.permissions.includes(permissions)
        if (!validPermissions) {
            return res.status(403).json({ 
                message: 'Permission denied!'
            })
        }

        return next()
    }
}

// handle error api middleware
const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = { 
    apiKey,
    permissions,
    asyncHandler
}