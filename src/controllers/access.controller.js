'use strict'

const AccessService = require("../services/access.service");
const { SuccessResponse, OK, CREATED } = require("../helpers/success.response")

class AccessController {

    handlerRefreshToken = async (req, res, next) => {
        // new SuccessResponse ({
        //     message: "Get token success!",
        //     metadata: await AccessService.handlerRefeshToken( req.body.refreshToken )
        // }).send(res)

        // v2 authentication fixed
        new SuccessResponse ({
            message: "Get token success!",
            metadata: await AccessService.handlerRefeshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessResponse ({
            message: "Logout success!",
            metadata: await AccessService.logout( req.keyStore ) // keyStore da truyen len req trong authentication middleware
        }).send(res)
    }
    
    login = async (req, res, next) => {
        new SuccessResponse ({
            message: "Login success!",
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {
        new CREATED ({
            message: 'Resgisted OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
    }

}

module.exports = new AccessController()