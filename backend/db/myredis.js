const redis = require('redis');

const redis_port = 6379;
const redis_client = redis.createClient(redis_port, '127.0.0.1', {});
redis_client.on("error", function (err) {
  console.log(`Redis error: ${err}`);
})
redis_client.on("connect", function(){
  // start server();
  console.log(`Redis connected`);
});
redis_client.connect();

module.exports = redis_client;