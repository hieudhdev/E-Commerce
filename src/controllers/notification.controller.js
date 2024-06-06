'use strict'

const NotificationService = require('../services/notification.service')
const { SuccessResponse, OK, CREATED } = require("../helpers/success.response")

class NotificationController {

    getListNotiByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list noti success',
            metadata: await NotificationService.listNotiByUser( req.body )
        }).send(res)
    }

}   

module.exports = new NotificationController()