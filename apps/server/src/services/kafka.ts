import { Kafka, Producer } from "kafkajs";
import { KAFKA_CLIENT } from "../secrets";
import prisma from "./prisma";

const kafka = new Kafka(KAFKA_CLIENT);

let producer: null | Producer = null;

export async function createKafkaProducer() {
    try {
        if (producer) return producer;

        const _producer = kafka.producer();
        await _producer.connect();

        producer = _producer;

        return producer;
    } catch (error) {
        console.error("Error creating Kafka producer:", error);
        throw error;
    }
}

export async function produceMessage(message: string) {
    const producer = await createKafkaProducer();

    await producer.send({
        messages: [{ key: `message-${Date.now()}`, value: message }],
        topic: "MESSAGES",
    })

    return true;
}

export async function startKafkaConsumer() {
    const consumer = kafka.consumer({ groupId: "default" });

    await consumer.connect();
    await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

    await consumer.run({
        autoCommit: true,
        eachMessage: async ({ topic, partition, message, pause }) => {
            if (message.value === null) return;

            console.log({ value: message.value?.toString() });

            try {
                await prisma.message.create({
                    data: {
                        text: message.value?.toString(),
                    }
                });
            } catch (error) {
                console.error("pausing, Error creating message in db:", error);
                pause();
                setTimeout(() => {
                    console.log("resuming consumer");
                    consumer.resume([{ topic: "MESSAGES" }]);
                }, 60 * 1000);
            }
        },
    });
}

export default kafka;
