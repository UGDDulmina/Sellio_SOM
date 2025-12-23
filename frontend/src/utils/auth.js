export const setAuth = (data) => {
  localStorage.setItem("sellio_access", data.accessToken);
  localStorage.setItem("sellio_refresh", data.refreshToken);
  localStorage.setItem("sellio_user", JSON.stringify(data.user));
};

export const clearAuth = () => {
  localStorage.removeItem("sellio_access");
  localStorage.removeItem("sellio_refresh");
  localStorage.removeItem("sellio_user");
};

export const getAccessToken = () => localStorage.getItem("sellio_access");
export const getRefreshToken = () => localStorage.getItem("sellio_refresh");
export const getUser = () => {
  const raw = localStorage.getItem("sellio_user");
  return raw ? JSON.parse(raw) : null;
};
