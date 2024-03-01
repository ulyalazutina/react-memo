const API_URL = "https://wedev-api.sky.pro/api/leaderboard";

export async function getList() {
  const response = await fetch(API_URL, {
    method: "GET",
  });

  if (response === "Failed to fetch") {
    throw new Error("Ошибка сервера");
  }

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

  if (response.status === 400) {
    throw new Error("Ошибка сервера");
  }
  const data = response.json();
  return data;
}
