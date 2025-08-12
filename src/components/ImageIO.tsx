"use client";

import { Image } from '@imagekit/next';

type ImageType = {
  path: string;
  w?: number;
  h?: number;
  alt: string;
  className?: string;
  tr?: boolean;
};

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

if (!urlEndpoint) {
  throw new Error('Error: Please add urlEndpoint to .env or .env.local')
}

const ImageIO = ({ path, w, h, alt, className, tr }: ImageType) => {
  return (
    <Image
      urlEndpoint={urlEndpoint}
      src={path}
       width= {w ?? 100}
       height= {h ?? 100}
      {...(tr
        ? { transformation: [{ width: w ?? 100, height: h ?? 100 }] }
        : { })}
      alt={alt}
      className={className}
    />
  );
};

export default ImageIO;