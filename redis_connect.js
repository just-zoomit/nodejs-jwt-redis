const redis = require('redis');

// connect to redis

const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

redisClient.on('connect', () => {
    console.log('Connected to Redis Client');
}
);

redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
}
);

redisClient.on('ready', () => {
    console.log('Redis is ready');
})

redisClient.on('end', () => {
    console.log('Redis connection ended');
})

process.on('SIGINT', () => {
    redisClient.quit();
})

//client.connect() returns a promise. You gotta use .then() because you cannot call await outside of a function.
redisClient.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.log(err.message);
})



module.exports = redisClient;