import { UserAddress } from './users.model';

export interface PutUserDto {
  email: string;
  password: string;
  phone_number: string;
  family_name: string;
  given_name: string;
  picture: string;
  username: string;
}

export interface PutUserMetadataDto {
  genre: string;
  birth_date: string;
  addresses: UserAddress[];
  status: 'active' | 'closed';
}

export interface CreateUserDto {
  email: string;
  password: string;
}
