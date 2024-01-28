// 'use strict'

// // Optimistic 
// const redis = require('redis')
// const { promisify } = require('util')
// const redisClient = redis.createClient()

// const pexpire = promisify(redisClient.pexpire).bind(redisClient)
// const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

// const acquireLock = async (productId, quantity, cartId) => {
//     const key = `lock_v2023_${productId}`
//     const retryTime = 10
//     const expireTime = 3000 // 3 second

//     for (let i = 0; i < retryTime.length; i++) {
//         // tao 1 key, thang nao cam duoc key thi duoc vao thanh toan
//         const result = await setnxAsync(key, expireTime)

//         if (result == 1) {
//             // thao tac voi inventories
//             const isReservation = await reservationInventory({
//                 productId, quantity, cartId
//             })

//             if (isReservation.modifiedCount) {
//                 await pexpire(key, expireTime)
//                 return key
//             }

//             return null
//         } else {
//             await new Promise((resolve) => setTimeout(resolve, 50 ))
//         }
//     }
// }

// const releaseLock = async keylock => {
//     const delAsyncKey = promisify(redisClient.del).bind(redisClient)
//     return await delAsyncKey(keylock)
// }

// module.exports = {
//     acquireLock,
//     releaseLock
// }