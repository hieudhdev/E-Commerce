'use strict'

const cart = require('../models/cart.model')
const { BabRequestError, NotFoundError, NotFoundError } = require('../core/error.response')
const {
    findCartById
} = require('../models/repositories/cart.repo')
const { 
    checkProductByServer 
} = require('../models/repositories/product.repo')

class CheckoutService {
    
    /*
    //  login or without login, depend on business login
        PAYLOAD
        {
            cartId,
            userId,
            shop_order_ids: [   // có thể order từ nhiều shop khác nhau (business logic)
                {
                    shopId,
                    shop_discount: [
                        {
                            "shopId",
                            "disocuntId",
                            "codeId"
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ],
                },
                // .... another shop
            ]
        }
    */
    static async checkoutReview ({
        cartId, userId, shop_order_ids
    }) {
        // check cartId exist ?
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new NotFoundError('Cart not exist')

        const checkout_order = {    
            totalPrice: 0,  // tổng tiền
            feeShip: 0,     // phí ship
            totalDiscount: 0,   // voucher giảm giá
            totalCheckout: 0    // tổng tiền thanh toán
        }
        const shop_order_ids_new = []   // tính toán giá thành tiền từng item -> một list sản phẩm mới

        // tính tổng tiền bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discount = [], item_products = [] } = shop_order_ids[i]

            // check product available
            const checkProductServer = await checkProductByServer(item_products)
            if (!checkProductServer) {
                throw new BabRequestError('Order fail !')
            }

        }

        

    }

}

module.exports = CheckoutService