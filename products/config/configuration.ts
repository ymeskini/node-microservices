export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    url: process.env.MONGO_URL,
  },
  auth: {
    issuerURL: 'https://ym-toptal.eu.auth0.com/',
    audience: 'https://ym-toptal-users.com',
  },
});
