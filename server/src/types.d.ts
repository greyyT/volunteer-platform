import { Request } from 'express';

type AuthPayload = {
  id: string;
  email: string;
  isOrganization: boolean;
};

export type RequestWithAuth = Request & AuthPayload;
