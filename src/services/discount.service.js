'use strict'

const discount = require('../models/discount.model')
const { 
    BabRequestError,
    NotFoundError
} = require('../core/error.response')
const { convertToObjectId } = require('../utils/index')
const { findAllProducts } = require('../models/repositories/product.repo')
const { 
    findAllDiscountCodesSelect,
    findAllDiscountCodesUnSelect,
    checkDiscountExists
} = require('../models/repositories/discount.repo')

/*
    Discount service
    1 - Generator Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [User]
    5 - Delete dicsount code [Shop | Admin]
    6 - Cancel discount code [User]
*/

class DiscountService {

    static async createDiscountCode (payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to,
            name, description, type, value, max_value, max_uses,
            uses_count, max_uses_per_user
        } = payload

        // check date - validate input request 
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BabRequestError('Discount code has expried')
        }
        if (new Date(start_date) >= new Date(end_date)) {
            throw new BabRequestError('Start date must be before end date')
        }

        // create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectId(shopId),
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BabRequestError('Discount code has existed')
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,   
            discount_value: value,   
            discount_code: code, 
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,    
            discount_uses_count: uses_count,   
            discount_users_used: users_used, 
            discount_max_uses_per_user: max_uses_per_user, 
            discount_min_order_value: min_order_value || 0,     
            // discount_max_value: max_value,
            discount_shopId: shopId, 
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return newDiscount
    }

    static async updateDiscountCode () {

    }

    // Get all Products by DiscountCode [User]
    // Khi bấm vào 1 voucher discount thì sẽ hiển thị ra các sản phẩm phù hợp với voucher đó
    static async getAllDiscountCodesWithProduct ({ code, shopId, userId, limit, page }) {
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectId(shopId),
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exist or expried')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                filter: { 
                    product_shop: convertToObjectId(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if (discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: { 
                    _id: {$in: discount_product_ids},
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products
    }

    // Get all discount code of shop
    static async getAllDiscountCodesByShop ({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: shopId,
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discount
        })

        return discounts
    }

    /*
        Apply discount code
    */
    static async getDiscountAmount ({ code, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: code,
                shopId: convertToObjectId(shopId)
            }
        })

        if (!foundDiscount) throw new NotFoundError('Discount not exists')

        const { 
            discount_is_active,
            discount_max_uses,   // uses remaining
            discount_min_order_value,
            discount_max_uses_per_user, // uses remaining
            discount_users_used,
            discount_value,
            discount_type
        } = foundDiscount    // destructuring ES6

        if (!discount_is_active) throw new NotFoundError('Discount expried')
        if (!discount_max_uses) throw new NotFoundError('Discount is out')
        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new NotFoundError('Discount has expired')
        }
        // check minimum price to get discount
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            totalOrder = products.reduce( (total, product) => {
                return total + (product.price * product.quantity)
            }, 0)

            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError('Discount require a minimum price of an order')
            }
        }

        // check max uses for per user
        if (discount_max_uses_per_user > 0) {
            const userUserDiscount = discount_users_used.find( user => user.userId === userId )
            if (userUserDiscount) {
                // .....
            }
        }

        // check discount amount or percent
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode ({ shopId, codeId }) {
        const deleted = await discount.findOneAndDelete({ 
            discount_code: codeId,
            discount_shopId: convertToObjectId(shopId)
        })

        return deleted
    }

}