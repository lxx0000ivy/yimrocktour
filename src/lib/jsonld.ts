import type { Locale } from '../i18n';

const ORG_NAME = 'Yim Rock Tour';
const ORG_NAME_ZH = '逸攀';

export function organizationJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'TravelAgency'],
    name: ORG_NAME,
    alternateName: ORG_NAME_ZH,
    url: siteUrl,
    logo: new URL('/favicon.svg', siteUrl).toString(),
    areaServed: 'Yunnan, China',
  };
}

export interface TourJsonLdInput {
  siteUrl: string;
  pageUrl: string;
  name: string;
  description: string;
  image: string;
  location: string;
  durationDays: number;
  priceCNY?: number;
  locale: Locale;
}

export function touristTripJsonLd(input: TourJsonLdInput) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: input.name,
    description: input.description,
    image: input.image,
    url: input.pageUrl,
    itinerary: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'Place',
          name: input.location,
        },
      ],
    },
    provider: {
      '@type': 'TravelAgency',
      name: ORG_NAME,
      url: input.siteUrl,
    },
  };
  if (input.priceCNY !== undefined) {
    data.offers = {
      '@type': 'Offer',
      price: input.priceCNY,
      priceCurrency: 'CNY',
      availability: 'https://schema.org/InStock',
    };
  }
  return data;
}

export interface PostJsonLdInput {
  siteUrl: string;
  pageUrl: string;
  title: string;
  description: string;
  image?: string;
  publishDate: Date;
  updatedDate?: Date;
  author?: string;
}

export function blogPostingJsonLd(input: PostJsonLdInput) {
  // When a human author is set, emit Person; fall back to the brand org.
  const author = input.author
    ? { '@type': 'Person', name: input.author }
    : { '@type': 'Organization', name: ORG_NAME };

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    image: input.image,
    url: input.pageUrl,
    mainEntityOfPage: input.pageUrl,
    datePublished: input.publishDate.toISOString(),
    dateModified: (input.updatedDate ?? input.publishDate).toISOString(),
    author,
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      logo: {
        '@type': 'ImageObject',
        url: new URL('/favicon.svg', input.siteUrl).toString(),
      },
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbJsonLd(trail: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
