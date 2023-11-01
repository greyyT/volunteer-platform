import { writeFileSync } from 'fs';
import { join } from 'path';

export const saveBase64 = (
  base64: string,
  slug: string,
  dir: string,
  isPublic: boolean,
) => {
  const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const dataBuffer = Buffer.from(matches[2], 'base64');

  writeFileSync(
    join(
      __dirname,
      `../../${isPublic ? 'public' : 'secret'}/${dir}/${slug}.png`,
    ),
    dataBuffer,
  );
};

export const saveMultipleBase64 = (
  base64s: string[],
  slug: string,
  id: string,
  dir: string,
  isPublic: boolean,
) => {
  base64s.forEach((base64, index) => {
    saveBase64(base64, `${slug}-${index}-${id}`, dir, isPublic);
  });
};
