module.exports = {
  DEBUG: true,
  server: {
    port: 5555,
    host: 'localhost',
    url: 'http://localhost:5555',
  },
  swagger: {
    definition: {
      tags: [{ name: 'auth' }, { name: 'users' }, { name: 'analytics' }],
      info: {
        title: 'User microservice',
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
    routes: {
      login: '/api/v1/auth/login',
      logout: '/api/v1/auth/logout',
    },
    authorizationParams: {
      response_type: 'code',
      scope:
        'openid email profile read:users create:users update:users delete:users',
      audience: process.env.AUTH0_AUDIENCE,
    },
  },
};
