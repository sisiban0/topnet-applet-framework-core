export const loadApi = function (r) {
  const api = {};
  r.keys().forEach((key) => {
    const value = r(key);
    Object.assign(api, value);
  });
  return api;
};
const api = loadApi(require.context("@/pages/", true, /api.js$/));

export default api;
