amqp = require('amqplib');

const channelName = 'test_rabbitmq'

const runConsumer = async () => {
    try {
        const connect = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connect.createChannel()

        await channel.assertQueue(channelName, {
            durable: true,
        })

        //receive messages from Producer channel
        channel.consume(channelName, (message) => {
            console.log(message.content.toString())
        }, {
            noAck: true,
        })

    } catch (err) {
        console.error(err)
    }
}

runConsumer().catch(err => {console.error(err)});