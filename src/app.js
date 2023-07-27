const express = require('express')
const app = express()
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
require('dotenv').config()

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

// init db
require('./databases/init.mongodb')
const { countConnect, checkOverLoad } = require('./helpers/check.connect')
// countConnect()
// checkOverLoad()

// init routes
app.use('', require('./routes/index'))

// handling error
app.use((req, res, next) => {
    const error = new Error('Not found!')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,  
        message: error.message || 'Internal Server Error',
        stack: error.stack
    })
})

module.exports = app