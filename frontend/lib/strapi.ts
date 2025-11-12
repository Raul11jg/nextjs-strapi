const BASE_URL = "http://localhost:1337";

export async function getStrapiData(url: string) {
  try {
    const resp = await fetch(`${BASE_URL}${url}`);
    if (!resp.ok) {
      throw new Error(`HTTP error, status: ${resp.status}`);
    }
    const { data } = await resp.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
