'use strict'

const mongoose = require('mongoose')
const { db: {host, port, name} } = require('./config.mongodb')
const connectStr = `mongodb://${host}:${port}/${name}`

// SINGLETON PATTERN CONNECT DATABASES
class Database {

    constructor () {
        this.connect()
    }

    connect (type = 'mongodb') {

        // Set log query db in dev invironment
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }

        // Connect mongodb
        mongoose.connect(connectStr)
        .then(() => console.log('Connect database successfully! (SINGLETON PATTERN)'))
        .catch(err => console.log('Error connect!'))
    }

    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }

}

const intanceMongodb = Database.getInstance()
module.exports = intanceMongodb