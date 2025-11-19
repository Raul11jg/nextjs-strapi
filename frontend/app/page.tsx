import { getHomePage } from "@/lib/strapi";
import { HeroSection } from "@/components/hero-section";

export async function generateMetadata() {
  const strapiData = await getHomePage();
  const { title, description } = strapiData;
  return {
    title,
    description,
  };
}

export default async function Home() {
  const strapiData = await getHomePage();

  const { title, description, sections } = strapiData;
  const heroSectionData = sections.find(
    (section: { __component: string }) =>
      section.__component === "layout.hero-section"
  );

  return (
    <main>
      {title && <h1 className="p-2 text-center text-5xl font-bold">{title}</h1>}
      {description && <p className="p-2 text-center text-lg">{description}</p>}
      <HeroSection data={heroSectionData} />
    </main>
  );
}
