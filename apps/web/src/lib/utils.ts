import { clsx, type ClassValue } from "clsx";
import type { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SITE_NAME = "tunnel";
const SITE_DESCRIPTION = "easy localhost to public";
const HOME_DOMAIN = "https://tunnel.jabed.dev";

/**
 * @description construct nextjs metadata
 * @param {Object} param0
 * @param {string} param0.title
 * @param {string} param0.description
 * @param {string} param0.image
 * @param {string} param0.video
 * @param {Metadata["icons"]} param0.icons
 * @param {string} param0.canonicalUrl
 * @param {boolean} param0.noIndex
 * @returns
 */
export function constructMetadata({
  title = SITE_NAME,
  description = SITE_DESCRIPTION,
  image = `${HOME_DOMAIN}/og-image.png`,
  video,
  icons = [
    {
      rel: "icon",
      type: "image/x-icon",
      sizes: "16x16",
      url: `${HOME_DOMAIN}/favicon.ico`,
    },
    {
      rel: "apple-touch-icon",
      sizes: "32x32",
      url: `${HOME_DOMAIN}/apple-touch-icon.png`,
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: `${HOME_DOMAIN}/favicon-32x32.png`,
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: `${HOME_DOMAIN}/favicon-16x16.png`,
    },
  ],
  canonicalUrl,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string | null;
  video?: string | null;
  icons?: Metadata["icons"];
  canonicalUrl?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    openGraph: {
      title,
      description,
      ...(image && {
        images: image,
      }),
      ...(video && {
        videos: video,
      }),
    },
    twitter: {
      title,
      description,
      ...(image && {
        card: "summary_large_image",
        images: [image],
      }),
      ...(video && {
        player: video,
      }),
      creator: "@dla",
    },
    icons,
    metadataBase: new URL("https://dreamhunt.io"),
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
