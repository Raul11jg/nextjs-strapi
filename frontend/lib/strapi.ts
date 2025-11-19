import { SignInSchema, SignUpSchema } from "@/validations/auth";
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
  "use cache";
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

export async function registerUser(userData: SignUpSchema) {
  const url = `${STRAPI_BASE_URL}/api/auth/local/register`;

  //Strapi requires username and password
  const payload = {
    username: userData.fullName,
    email: userData.email,
    password: userData.password,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
}

export async function loginUser(userData: SignInSchema) {
  const url = `${STRAPI_BASE_URL}/api/auth/local`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
