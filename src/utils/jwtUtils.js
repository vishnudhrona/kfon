export const parseJwt = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decodedToken = parseJwt(token);

  if (!decodedToken || !decodedToken.exp) {
    return true; // Treat invalid/missing tokens as expired
  }

  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};
