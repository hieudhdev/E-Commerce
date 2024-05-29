'use strict'

const Joi = require('joi')

// sign up
const userSignupSchema = Joi.object({
    name: Joi.string().min(6).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})

// login
const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})

module.exports = {
    userSignupSchema,
    userLoginSchema
}