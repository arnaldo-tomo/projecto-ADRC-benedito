// utils/validation.ts
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^(\+258\s?)?[0-9]{8,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  password: (password: string): boolean => {
    return password.length >= 6;
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  },
};