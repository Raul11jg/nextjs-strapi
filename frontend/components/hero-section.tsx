import Link from "next/link";
import { STRAPI_BASE_URL } from "@/lib/strapi";

interface ImageProps {
  id: number;
  url: string;
  alternativeText: string;
}

interface LinkProps {
  id: number;
  url: string;
  name: string;
  isExternal: boolean;
}

interface HeroSectionProps {
  data: {
    id: number;
    __component: string;
    title: string;
    subHeader: string;
    image: ImageProps;
    headerLink: LinkProps;
  };
}

export function HeroSection({ data }: HeroSectionProps) {
  if (!data) return null;

  const { title, subHeader, image, headerLink } = data;
  const imageUrl = image?.url.startsWith("http")
    ? image.url
    : `${STRAPI_BASE_URL}${image.url}`;

  return (
    <header className="relative z-0 h-[50vh] min-h-[400px] w-full overflow-hidden">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={image?.alternativeText ?? "no alternative text"}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          src={imageUrl}
        />
      )}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/10 via-transparent to-black/60" />
      <div className="container mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg md:text-7xl lg:text-8xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-medium drop-shadow-md md:text-2xl">
          {subHeader}
        </p>
        {headerLink && (
          <Link
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-10 inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
            href={headerLink.url}
          >
            {headerLink.name}
          </Link>
        )}
      </div>
    </header>
  );
}
