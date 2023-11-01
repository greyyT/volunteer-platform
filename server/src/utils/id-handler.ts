import { customAlphabet } from 'nanoid';

export const createEventId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  15,
);
