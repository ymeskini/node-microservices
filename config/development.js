module.exports = {
  DEBUG: true,
  server: {
    port: 5555,
    host: 'localhost',
  },
  db: {
    url: process.env.MONGODB_URL,
  },
  swagger: {
    definition: {
      basePath: '/api/v1',
      info: {
        title: 'Users API',
        version: '1.0.0',
      },
    },
    apis: ['./src/**/*.routes.ts'],
  },
  auth0: {
    clientID: process.env.AUTH0_CLIENT_ID,
    secret: process.env.AUTH0_SECRET,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    baseURL: 'http://localhost:5555',
    authorizationParams: {
      response_type: 'code id_token',
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email',
    },
  },
};
