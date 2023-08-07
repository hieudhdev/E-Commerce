'use strict'

const cart = require('../models/cart.model')
const { BabRequestError, NotFoundError } = require('../core/error.response')
const { getProductById } = require('../models/repositories/product.repo')

/*
    Key feature: Cart Service
    1 - add product to cart [User]
    2 - decrease product quantity by one [User]
    3 - increase product quantity by one [User]
    4 - get cart [User]
    5 - delete cart [User]
    6 - delete cart item [User]
*/

class CartService {

    // START REPO CART
    static async createUserCart ({ userId, products }) {
        const query = { cart_userId: userId, cart_state: 'active' }
        const updateOrInsert = {
            $addToSet: {
                cart_products: products
            }
        }
        const options = { upsert: true, new: true }

        return await cart.findOneAndUpdate( query, updateOrInsert, options )
    }

    static async updateUserCartQuantity ({ userId, products }) {
        const { productId, quantity } = products
        const query = { 
            cart_userId: userId,
            'cart_products.productId': productId, // nếu truy cập vào property của obj thì cần trong ngoặc ''
            cart_state: 'active'
        }
        const updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }
        const options = { upsert: true, new: true }

        return await cart.findOneAndUpdate( query, updateSet, options )
    }
    // END REPO CART

    // add product to cart
    static async addToCart ({ userId, products = {} }) {
        // check cart exist
        // nếu chưa có cart thì tạo cart
        // nếu có cart rồi thì tìm trong cart có product đấy không ? add new : increase quantity  
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            return await CartService.createUserCart({ userId, products })
        }

        // nếu có cart rồi nhưng chưa có products
        if (!userCart.cart_products.length) {
            userCart.cart_products = [products]
            return await userCart.save()
        }

        // nếu cart tồn tại và có products này -> update quantity
        return await CartService.updateUserCartQuantity({ userId, products })
    }
    
    // increase/decrease product in cart
    /*  
        -- UPDATE CART --
        -- BODY or PAYLOAD --
        shop_orders_ids: [
            {
                shopId,
                item_products: [
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        productId
                    }
                ],
                version
            }
        ]
    */
    static async addToCartV2 (userId, product = {}) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        // check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('Products not exist')

        // compare shopId
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to this shop')
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    // delete cart or delete cart items
    static async deleteUserCart ({ userId, productId }) {
        const query = { 
            cartUserId: userId, 
            cart_state: 'active'
        }
        const updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }

        const deleteCart = await cart.updateOne(query, updateSet)
    }

    // get cart (list products) for user
    static async getListUserCart ({ userId}) {
        return await cart.findOne({
            cart_user: +userId
        }).lean()
    }

}
