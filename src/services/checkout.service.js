'use strict'

const cart = require('../models/cart.model')
const order = require('../models/order.model')
const { BabRequestError, NotFoundError } = require('../core/error.response')
const {
    findCartById
} = require('../models/repositories/cart.repo')
const { 
    checkProductByServer 
} = require('../models/repositories/product.repo')
const DiscountService = require('./discount.service')
const { acquireLock, releaseLock } = require('./redis.service')

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
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]

            // check product available
            const checkProductServer = await checkProductByServer(item_products)
            if (!checkProductServer) {
                throw new BabRequestError('Order fail!')
            }

            // tổng tiền một mặt hàng trước giảm giá
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // tổng tiền trước giảm giá
            checkout_order.totalPrice += checkoutPrice
            
            // chi tiết giá của items trong giỏ hàng
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // nếu shop_discounts tồn tại, check xem có hợp lệ k
            if (shop_discounts.length > 0) {
                // get amount discount đó
                const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmount({
                    code: shop_discounts[0].codeId, // giả sử có 1 discount
                    userId: userId,
                    shopId: shopId,
                    products: checkProductServer

                })
                // tong cong discount giam gia
                checkout_order.totalDiscount += discount
                // neu tien giam gia > 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount =checkoutPrice - discount
                }
            }

            // tồng tiền thanh toán cuối cùng
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser ({
        shop_order_ids, cartId, userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId, 
            userId, 
            shop_order_ids
        })

        // check ton kho inventories (redis + optimistic)
        const products = shop_order_ids_new.flatMap( order => order.item_products )
        console.log(`[1]::`, products )
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push( keyLock ? true : false )

            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        // check neu co san pham het hang trong kho
        if (acquireProduct.includes(false)) {
            throw new BabRequestError('Some products have been updated, pls return to cart for more details!')
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
            // order_trackingNumber: '',
            // order_state: ''
        })

        // neu insert thanh cong thi remove product trong cart
        if (newOrder) {
            // remove products in cart
        }

        return newOrder
    }

    
    // 1 - query all orders [User]
    static async getOrdersByUser() {

    }

    // 2 - query an orders [User]
    static async getOneOrderByUser() {

    }

    // 3 - cancel order [User]
    static async cancelOrderByUser() {

    }

    // 4 - update orders status [Shop|Admin] - level pro
    static async updateOrderStatusByShop() {

    }

}

module.exports = CheckoutService