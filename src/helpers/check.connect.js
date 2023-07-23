'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECOND = 5000;

// count connect
const countConnect = () => {
    const numConnections = mongoose.connections.length
    console.log(`Number of connections:: ${numConnections}`)
} 

// check over load
const checkOverLoad = () => {
    setInterval( () => {
        const numConnections = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss

        // suppose maximum numbers of connections based on number of cores
        const maxConnections = numCores * 5;

        console.log(`Active connections:: ${numConnections}`)
        console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`)

        if (maxConnections > maxConnections) {
            console.log(`Connections overload detected!`)
        }

    }, _SECOND) // monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverLoad
}