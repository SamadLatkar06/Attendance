export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateEnrollmentNumber = (number) => {
  return number && number.trim().length > 0
}

export const validateName = (name) => {
  return name && name.trim().length > 0
}
