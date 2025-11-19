import qs from "qs";

export const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

const QUERY_HOME_PAGE = {
  populate: {
    sections: {
      on: {
        "layout.hero-section": {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
            headerLink: {
              populate: "*",
            },
          },
        },
      },
    },
  },
};

export async function getHomePage() {
  const query = qs.stringify(QUERY_HOME_PAGE, {
    encodeValuesOnly: true,
  });

  const response = await getStrapiData(`/api/home-page?${query}`);
  return response?.data;
}

export async function getStrapiData(url: string) {
  try {
    const resp = await fetch(`${STRAPI_BASE_URL}${url}`);
    if (!resp.ok) {
      throw new Error(`HTTP error, status: ${resp.status}`);
    }
    const data = await resp.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
