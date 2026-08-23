export function toSafeUser(user) {
  const { password, resetToken, resetTokenExpires, ...safe } = user
  return safe
}
