// config/api.ts
const getApiBaseUrl = () => {
  // For development, you'll need to change this to your computer's IP address
  // Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to find your IP
  
  if (__DEV__) {
    // Replace with your actual IP address when testing on physical device
    return 'http://192.168.1.100:8000/api'; // Change this IP!
    // For iOS Simulator: 'http://localhost:8000/api'
    // For Android Emulator: 'http://10.0.2.2:8000/api'
  }
  
  // Production API URL
  return 'https://your-production-domain.com/api';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};