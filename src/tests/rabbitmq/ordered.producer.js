'use strict'

const amqp = require('amqplib')

const queueName = 'ordered-queue-message'

const producerOrderMessage = async () => {
    const connection = await amqp.connect('amqp://guest:guest@localhost')
    const channel = await connection.createChannel()

    await channel.assertQueue(queueName, {
        durable: true
    })

    for (let i  =0; i < 10; i++) {
        let msg = 'Message queue order : ' + i
        console.log(msg)
        await channel.sendToQueue(queueName, Buffer.from(msg), {
            persitent: true // To ensure messages in queue not deleted when RabbitMQ crash or restart
        })
    }

    setTimeout(() => {
        connection.close()
    }, 1000)
}

producerOrderMessage().catch((err) => console.log(err))