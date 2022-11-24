import axios from 'axios';
import config from 'config';
import { auth0RolesIds, UserRole } from '../users/users.model';

const auth0ClientID = config.get<string>('auth0.clientID');
const auth0ClientSecret = config.get<string>('auth0.clientSecret');
const auth0ApiBaseUrl = config.get<string>('auth0.issuerBaseURL');

const auth0Client = axios.create({
  baseURL: auth0ApiBaseUrl,
});

const baseData = {
  client_id: auth0ClientID,
  connection: 'Username-Password-Authentication',
};

export const changePasswordRequest = (email: string) =>
  auth0Client.post('/dbconnections/change_password', { email, ...baseData });

const updateUserRequest = (id: string, data: any, accessToken: string) =>
  auth0Client.patch(
    `/api/v2/users/${id}`,
    { ...data, ...baseData },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

export const updateUserEmail = (
  userId: string,
  email: string,
  accessToken: string,
) => updateUserRequest(userId, { email, verify_email: true }, accessToken);

export const blockUser = (userId: string, accessToken: string) =>
  updateUserRequest(userId, { blocked: true }, accessToken);

type CreateUserBody = {
  email: string;
  password: string;
};

export const createAuth0User = (body: CreateUserBody, accessToken: string) =>
  auth0Client.post(
    '/api/v2/users',
    {
      ...body,
      // sends email verification
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
      client_id: auth0ClientID,
      client_secret: auth0ClientSecret,
      audience: `${auth0ApiBaseUrl}/api/v2/`,
    }),
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    },
  );

export const assignRoleToUser = (
  id: string,
  roles: UserRole[],
  accessToken: string,
) =>
  auth0Client.post(
    `/api/v2/users/${id}/roles`,
    {
      roles: roles.map((role) => auth0RolesIds[role]),
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

export const deleteAuth0User = async (id: string) => {
  const { data: token } = await getAuth0Token();
  return auth0Client.delete(`/api/v2/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });
};
