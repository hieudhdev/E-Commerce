const amqp = require('amqplib');

const runProducer = async () => {
    try {
        const connect = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connect.createChannel()

        const notiQueue = 'notiQueueProcess' // queue for notification success
        const notiExchange = 'notiExchange' // exchange be routed and send message (for noti queue)
        const notiExchangeDLX = 'notiExchangeDLX' // exchange for Dead Leter
        const notiRoutingKeyDLX = 'notiRoutingKeyDLX' // routing-key is route

        // 1. create exchange
        await channel.assertExchange(notiExchange, 'direct', {
            durable: true,
        })

        // 2. create queue (assign exchangeDlX to notiQueue)
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,   // allow mutil connect access to queue as the same time
            deadLetterExchange: notiExchangeDLX,
            deadLetterRoutingKey: notiRoutingKeyDLX
        })

        // 3. bind queue (connect Exchange to notiQueue)
        await channel.bindQueue(queueResult.queue, notiExchange)

        // 4. send messages to Comsumer channel
        const msg = 'New product: Iphone 14 promax'
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        })
        console.log(`message send::`, msg)

        setTimeout(() => {
            connect.close();
            process.exit(0)
        }, 500)


    } catch (err) {
        console.error(err)
    }
}

runProducer().catch(err => {console.error(err)});