export const checkSession = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/session", {
      credentials: "include",
    });
    const json = await response.json();
    if (!json.success) return null;
    return json.user;
  } catch (error) {
    console.log("checkSession:", error);
    return null;
  }
};
