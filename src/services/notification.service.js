'use strict'

const notification = require('../models/notification.model')

class NotificationService {

    // Noti --> Noti System <--> User (pull or push)
    static async pushNotiToSystem ({ 
        type = 'SHOP-001',
        receivedId = 1,
        senderId = 1,
        options = {}
    }) {
        let noti_content

        switch (type) {
            case 'ORDER-001':
                noti_content = `XXX đã đặt hàng thành công!`;
                break;
            case 'ORDER-002':
                noti_content = `XXX đã đặt hàng thành công!`;
                break;
            case 'PROMOTION-001':
                noti_content = `Shop XXX vừa thêm một voucher mới XXXX`;               
                break;
            case 'SHOP-001':
                noti_content = `Shop XXX vừa thêm một sản phẩm mới XXXX`;               
                break;
            default:
                noti_content = `Type noti error!`
                break;
        }

        const newNoti = notification.create({
            noti_type: type,
            noti_senderId: senderId,
            noti_receivedId: receivedId,
            noti_content: noti_content,
            noti_options: options
        })

        return newNoti
    }

    static async listNotiByUser ({ 
        userId = 1, 
        type = 'ALL'
    }) {
        const match = {
            noti_receivedId: userId
        }

        if (type !== 'ALL') {
            match['noti_type'] = type 
        }

        const listNotifications = await notification.aggregate([{
            $match: match
        },
        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_receivedId: 1,
                noti_content: {
                    $concat: [
                        ' Shop ',
                        {
                            $substr: ['$noti_options.shop_name', 0, -1]
                        },
                        ' vừa thêm một sản phẩm mới: ',
                        {
                            $substr: ['$noti_options.product_name', 0, -1]
                        }
                    ]
                },
                createdAt: 1,
                noti_options: 1
            }
        }])

        return listNotifications
    }

}

module.exports = NotificationService