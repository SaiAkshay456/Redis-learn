import ioredis from 'ioredis';
const redisClient = new ioredis();

//first function in redis
async function connect() {
    try {
        const data = await redisClient.set('name', 'Akki');
        const value = await redisClient.get('name');
        console.log('Redis value:', value)
        const data1 = await redisClient.set('name', 'sai');
        const value1 = await redisClient.get('name');
        console.log('Redis value:', value1);
        await apiCall();
    } catch (err) {
        console.log(err);
    }
}

async function apiCall() {
    console.log('Api call');
    try {
        const response = await fetch('https://dummyjson.com/users/1');
        const data = await response.json();
        await redisClient.set('product:1', JSON.stringify(data), 'EX', 600);
        const cachedData = await redisClient.get('weather:NYC');
        console.log('product:', JSON.parse(cachedData));
    } catch (err) {
        console.log(err);
    }
}


connect();