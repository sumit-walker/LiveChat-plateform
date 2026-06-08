const devOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export const getAllowedOrigins = () =>
  [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    process.env.RENDER_EXTERNAL_URL,
  ].filter(Boolean);

export const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const isDev = process.env.NODE_ENV !== "production";
  if (isDev && devOriginPattern.test(origin)) return true;

  return getAllowedOrigins().includes(origin);
};
