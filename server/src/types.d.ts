import { Request } from 'express';

type AuthPayload = {
  id: string;
  email: string;
  isOrganization: boolean;
};

export type RequestWithAuth = Request & AuthPayload;

type AccountInfo = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  location: string;
  portrait: string;
  isVerified: boolean;
  isOrganization: boolean;
};
