require('dotenv').config();
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.URL;
const QUEUE = process.env.QUEUE;

async function consume() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: false });

    console.log(`Waiting for messages in queue: ${QUEUE}`);

    channel.consume(
      QUEUE,
      (message) => {
        if (message !== null) {
          console.log('Received:', message.content.toString());
          channel.ack(message);
        }
      },
      { noAck: false },
    );

    connection.on('close', () => {
        console.log('Mất kết nối tới RabbitMQ');
        process.exit(1);  // Thoát ứng dụng với mã lỗi
    });

    connection.on('error', (err) => {
        console.error('Lỗi kết nối tới RabbitMQ:', err.message);
        process.exit(1);  // Thoát ứng dụng với mã lỗi
    });

  } catch (error) {
    console.error('Error in consumer:', error);
  }
}

module.exports = consume;
