'use strict'

const cart = require('../models/cart.model')
const { BabRequestError, NotFoundError } = require('../helpers/error.response')
const { getProductById } = require('../repositories/product.repo')
const { 
    findCartById,
    createUserCart,
    updateUserCartQuantity 
} = require('../repositories/cart.repo')

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

    // add product to cart
    static async addToCart ({ userId, products = {} }) {
        // check cart exist
        // nếu chưa có cart thì tạo cart
        // nếu có cart rồi thì tìm trong cart có product đấy không ? add new : increase quantity  
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            return await createUserCart({ userId, products })
        }

        // nếu có cart rồi nhưng chưa có products
        if (!userCart.cart_products.length) {
            userCart.cart_products = [products]
            return await userCart.save()
        }

        // check cart tồn tại và đã có sản phẩm khác
        let checkProductAddExistInCart = false
        userCart.cart_products.forEach( prod => {
            if (prod.productId === products.productId) {
                checkProductAddExistInCart = true
            }
        })
        if (!checkProductAddExistInCart) {
            return await createUserCart({ userId, products })
        }

        // nếu cart tồn tại và có products này -> update quantity
        return await updateUserCartQuantity({ userId, products })
    }
    
    // increase/decrease product in cart
    /*  
        -- UPDATE CART --
        -- BODY or PAYLOAD --
        shop_order_ids: [
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
    static async addToCartV2 ({ userId, shop_order_ids = [] }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        console.log(productId, quantity, old_quantity)
        // check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('Products not exist')

        // compare shopId
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to this shop')
        }

        if (quantity === 0) {
            // delete product
        }

        return await updateUserCartQuantity({
            userId,
            products: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    // delete cart or delete cart items
    static async deleteUserCartItem ({ userId, productId }) {
        const query = { 
            cart_userId: userId, 
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

        return deleteCart
    }

    // get cart (list products) for user
    static async getListUserCart ({ userId }) {
        return await cart.findOne({
            cart_userId: +userId
        }).lean()
    }

}

module.exports = CartService