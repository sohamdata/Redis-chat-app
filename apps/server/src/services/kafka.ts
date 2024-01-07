import { Kafka, Producer } from "kafkajs";
import { KAFKA_CLIENT } from "../secrets";

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

export default kafka;
