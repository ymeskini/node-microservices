export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    url: process.env.MONGO_URL,
  },
});
