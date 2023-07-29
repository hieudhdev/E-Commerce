'use strict'

const ProductService = require("../services/product.service")
const ProductServiceV2 = require("../services/product.service.xxx")
const { SuccessResponse, OK, CREATED } = require("../core/success.response")

class ProductController {

    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new product success!",
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    // update product for shop
    updateProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Update product success!",
            metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish product success!",
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "unPublish product success!",
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    /**
     * @desc get all drafts products for shop
     * @param {Number} limit 
     * @param {Number} skip 
     * @return {JSON}
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list drafts product success!",
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list publish product success!",
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list search publish product success!",
            metadata: await ProductServiceV2.searchProducts( req.params )
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list findAllProducts success!",
            metadata: await ProductServiceV2.findAllProducts( req.query )
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get a findProduct success!",
            metadata: await ProductServiceV2.findProduct({ 
                product_id: req.params.product_id 
            })
        }).send(res)
    }

}

module.exports = new ProductController()