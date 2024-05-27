'use strict'

const amqp = require('amqplib')

const queueName = 'ordered-queue-message'

const consumerOrderMessage = async () => {
    const connection = await amqp.connect('amqp://guest:guest@localhost')
    const channel = await connection.createChannel()

    await channel.assertQueue(queueName, {
        durable: true   // To ensure this queue not deleted when RabbitMQ crash or restart
    })

    channel.prefetch(1) // Make sure Consumer will handle 1 message at the same time

    await channel.consume(queueName, msg => {
        const message = msg.content.toString()
        // Mock consumer receive message be wrong in order
        setTimeout(() => {
            console.log(message)
            channel.ack(msg)
        }, Math.random() * 1000)
    })

}

consumerOrderMessage().catch(err => console.log(err))
