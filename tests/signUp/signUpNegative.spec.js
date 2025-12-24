import { test } from '../_fixtures/fixtures';
import {
  EMPTY_USERNAME_MESSAGE,
  EMPTY_EMAIL_MESSAGE,
  EMPTY_PASSWORD_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  PASSWORD_TOO_SHORT_MESSAGE,
} from '../../src/ui/constants/authErrorMessages';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';

const user = generateNewUserData();

const testParameters = [
  {
    username: '',
    email: user.email,
    password: user.password,
    message: EMPTY_USERNAME_MESSAGE,
    title: 'empty username',
  },
  {
    username: user.username,
    email: '',
    password: user.password,
    message: EMPTY_EMAIL_MESSAGE,
    title: 'empty email',
  },
  {
    username: user.username,
    email: 'invalidemail',
    password: user.password,
    message: INVALID_EMAIL_MESSAGE,
    title: 'invalid email',
  },
  {
    username: user.username,
    email: user.email,
    password: '',
    message: EMPTY_PASSWORD_MESSAGE,
    title: 'empty password',
  },
  {
    username: user.username,
    email: user.email,
    password: '123',
    message: PASSWORD_TOO_SHORT_MESSAGE,
    title: 'password too short',
  },
];

testParameters.forEach(({ username, email, password, message, title }) => {
  test.describe('Sign up negative tests', () => {
    test(`Sign up with ${title}`, async ({ signUpPage }) => {
      await signUpPage.open();
      await signUpPage.fillUsernameField(username);
      await signUpPage.fillEmailField(email);
      await signUpPage.fillPasswordField(password);
      await signUpPage.clickSignUpButton();
      await signUpPage.assertErrorMessageContainsText(message);
    });
  });
});
