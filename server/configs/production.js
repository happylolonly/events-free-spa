export default {
  port: 3090,
  vk: {
    app: 6131483,
    key: 'f4vLOjoPyKSOw4qXgb6y',
    token: 'b58844e3b58844e3b58844e34eb5d5cbf8bb588b58844e3ecf6456263d1070e24bb2a38',
  },
  db: {
    url: process.env.MONGO_URI,
  },
  redis: {
    uri: process.env.REDIS_URI,
  },
};
