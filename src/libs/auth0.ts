import axios from 'axios';

const auth0Client = axios.create({
  baseURL: 'https://ym-toptal.eu.auth0.com',
});

const baseData = {
  client_id: 'KRquB2LduPRtmRSeF9r2r3o97zNGURPC',
  connection: 'Username-Password-Authentication',
};

export const changePasswordRequest = (email: string) =>
  auth0Client.post('/dbconnections/change_password', { email, ...baseData });

export const updateUserEmail = (
  userId: string,
  email: string,
  accessToken: string,
) =>
  auth0Client.patch(
    `/api/v2/users/${userId}`,
    { email, ...baseData },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

type CreateUserBody = {
  email: string;
  password: string;
};

export const createAuth0User = (body: CreateUserBody, accessToken: string) =>
  auth0Client.post(
    '/api/v2/users',
    {
      ...body,
      verify_email: true,
      connection: 'Username-Password-Authentication',
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

export const getAuth0Token = () =>
  auth0Client.post(
    '/oauth/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env['AUTH0_CLIENT_ID'] as string,
      client_secret: process.env['AUTH0_CLIENT_SECRET'] as string,
      audience: 'https://ym-toptal.eu.auth0.com/api/v2/',
    }),
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    },
  );
