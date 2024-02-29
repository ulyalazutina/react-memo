const API_URL = "https://wedev-api.sky.pro/api/leaderboard";

export async function getList() {
  const response = await fetch(API_URL, {
    method: "GET",
  });
  const data = response.json();
  return data;
}

export async function addLeader({ name, time }) {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      name,
      time,
    }),
  });
  const data = response.json();
  return data;
}
