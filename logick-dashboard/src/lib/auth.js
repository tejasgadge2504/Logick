export const getTokenFromCookies = () => {
  const match = document.cookie.match(/(^| )token=([^;]+)/)
  return match ? match[2] : null
}
