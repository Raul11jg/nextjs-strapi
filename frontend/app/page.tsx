import { getStrapiData } from "@/lib/strapi";

export default async function Home() {
  const strapiData = await getStrapiData("/api/home-page");
  console.log(strapiData);
  const { title, description } = strapiData;

  return (
    <>
      <h1>{title}</h1>
      <p>{description}</p>
    </>
  );
}
