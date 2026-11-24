
const validateName = (name) => {
  const nameRegex = /^[\p{L}\s'-]+$/u;

  return (
    typeof name === 'string' &&
    name.trim().length >= 2 &&
    nameRegex.test(name.trim())
  );
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validatePhone = (phone) => {
  const phoneRegex = /^01[0125][0-9]{8}$/;
  return phoneRegex.test(phone.trim());
};

const validateDateOfBirth = (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const [year, month, day] = date.split('-').map(Number);
  const parsedDate = new Date(year, month - 1, day);

  const isValidDate =
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day;

  if (!isValidDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return parsedDate <= today;
};

export const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 8 characters.';
  }

  return errors;
};

export const validateRegister = ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  phone,
  dateOfBirth,
  gender,
}) => {
  const errors = {};

  if (!firstName?.trim()) {
    errors.firstName = 'First name is required.';
  } else if (!validateName(firstName)) {
    errors.firstName = 'Please enter a valid first name (at least 2 characters).';
  }

  if (!lastName?.trim()) {
    errors.lastName = 'Last name is required.';
  } else if (!validateName(lastName)) {
    errors.lastName = 'Please enter a valid last name (at least 2 characters).';
  }

  if (!email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!phone?.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!validatePhone(phone)) {
    errors.phone = 'Please enter a valid Egyptian phone number.';
  }

  if (!dateOfBirth?.trim()) {
    errors.dateOfBirth = 'Date of birth is required.';
  } else if (!validateDateOfBirth(dateOfBirth)) {
    errors.dateOfBirth = 'Use a valid date in YYYY-MM-DD format.';
  }

  if (!['Male', 'Female'].includes(gender)) {
    errors.gender = 'Please select your gender.';
  }

  return errors;
};
