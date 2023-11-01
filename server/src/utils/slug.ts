import * as slug from 'vietnamese-slug';

export const createSlug = (text: string): string => {
  return slug(text);
};
