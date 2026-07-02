export function validateUser(users, email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((entry) => entry.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return {
      success: false,
      message: 'No account found for that email. Please try again.'
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      message: 'Incorrect password. Please try again.'
    };
  }

  return {
    success: true,
    user: { ...user, password: undefined }
  };
}

export function getWeatherTheme(weatherCode, temperature) {
  if (weatherCode >= 95) {
    return 'stormy';
  }

  if (weatherCode >= 61 || weatherCode === 51 || weatherCode === 53 || weatherCode === 55) {
    return 'rainy';
  }

  if (weatherCode >= 71 && weatherCode <= 77) {
    return 'snowy';
  }

  if (weatherCode >= 45 && weatherCode <= 48) {
    return 'misty';
  }

  if (temperature < 10) {
    return 'cool';
  }

  return 'sunny';
}
