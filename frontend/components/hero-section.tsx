import Link from "next/link";
import Image from "next/image";

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
    description: string;
    image: ImageProps;
    headerLink: LinkProps;
  };
}

export function HeroSection({ data }: HeroSectionProps) {
  console.log(data);
  if (!data) return null;

  const { title, description, image, headerLink } = data;
  // TODO: Fix image URL for local development if needed (Strapi doesn't return full URL for local uploads usually)
  const imageUrl = image?.url ? "http://127.0.0.1:1337" + image.url : "";

  return (
    <header className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
      {imageUrl && <Image alt={image?.alternativeText ?? "no alternative text"} className="absolute inset-0 -z-10 object-cover" src={imageUrl} fill priority unoptimized />}
      <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/60 -z-10" />
      <div className="container mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl drop-shadow-lg">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg font-medium md:text-2xl drop-shadow-md">{description}</p>
        {headerLink && (
          <Link
            className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 active:scale-95"
            href={headerLink.url}
          >
            {headerLink.name}
          </Link>
        )}
      </div>
    </header>
  );
}
