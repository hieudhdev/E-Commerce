'use strict'

const discount = require('../models/discount.model')
const { 
    BabRequestError,
    NotFoundError
} = require('../core/error.response')
const { convertToObjectId } = require('../utils/index')

/*
    Discount service
    1 - Generator Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all dicount codes [User | Shop]
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


}