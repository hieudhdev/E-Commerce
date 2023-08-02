'use strict'

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
            name, description, type, value, max_value, max_uses
        } = payload
    }

}