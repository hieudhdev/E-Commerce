'use strict'

const Joi = require('joi')
const {StringJoiMessages} = require('../helpers/customJoiMessage')

// sign up
const userSignup = {
    body: Joi.object().keys({
        name: Joi.string().min(6).max(30).required().messages(StringJoiMessages),
        email: Joi.string().email().required().messages(StringJoiMessages),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages(StringJoiMessages)
    })
}

// login
const userLogin = {
    body: Joi.object().keys({
        email: Joi.string().email().required().messages(StringJoiMessages),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages(StringJoiMessages)
    })
}

module.exports = {
    userSignup,
    userLogin
}