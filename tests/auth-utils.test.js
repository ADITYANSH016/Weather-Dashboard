import test from 'node:test';
import assert from 'node:assert/strict';
import { validateUser, getWeatherTheme } from '../scripts/auth-utils.js';

test('validateUser returns success for correct credentials', () => {
  const users = [{ email: 'student@example.com', password: 'weather123', name: 'Ava' }];

  const result = validateUser(users, 'student@example.com', 'weather123');

  assert.equal(result.success, true);
  assert.equal(result.user.name, 'Ava');
});

test('validateUser returns an error message for a wrong password', () => {
  const users = [{ email: 'student@example.com', password: 'weather123', name: 'Ava' }];

  const result = validateUser(users, 'student@example.com', 'wrong');

  assert.equal(result.success, false);
  assert.match(result.message, /Incorrect password/i);
});

test('getWeatherTheme returns a matching theme for rainy weather', () => {
  assert.equal(getWeatherTheme(61, 16), 'rainy');
});
