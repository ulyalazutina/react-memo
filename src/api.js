const API_URL = "https://wedev-api.sky.pro/api/leaderboard";

export async function getList() {
  const response = await fetch(API_URL, {
    method: "GET",
  });
  const data = response.json();
  return data;
}
