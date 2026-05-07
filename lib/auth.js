export function saveToken(token) {
  localStorage.setItem('shop_token', token)
}

export function getToken() {
  return localStorage.getItem('shop_token')
}

export function removeToken() {
  localStorage.removeItem('shop_token')
}

export function isLoggedIn() {
  return !!localStorage.getItem('shop_token')
}