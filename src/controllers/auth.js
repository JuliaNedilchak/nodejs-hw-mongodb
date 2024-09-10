import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  sendResetEmail,
  resetPassword,
  loginOrRegisterWithGoogle,
} from '../services/auth.js';

import { generateAuthUrl } from '../utils/goodleOAuth2.js';
export async function registerController(req, res) {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const registeredUser = await registerUser(user);
  res.send({
    status: 201,
    message: '"Successfully registered a user!"',
    data: registeredUser,
  });
}

export async function loginController(req, res) {
  const { email, password } = req.body;
  const session = await loginUser(email, password);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.send({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}
export async function logoutController(req, res) {
  if (typeof req.cookies.sessionId === 'string') {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
  res.status(204).end();
}

export async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshUserSession(sessionId, refreshToken);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.send({
    status: 200,
    message: 'Refresh is completed',
    data: {
      accessToken: session.accessToken,
    },
  });
}
export async function sendResetEmailController(req, res) {
  const { email } = req.body;
  await sendResetEmail(email);
  res.send({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
}

export async function resetPasswordController(req, res) {
  const { password, token } = req.body;
  await resetPassword(password, token);
  res.send({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}
export async function getOAuthUrlController(req, res) {
  const url = generateAuthUrl();

  res.send({
    status: 200,
    message: 'Succesfully get Google OAuth URL',
    data: { url },
  });
}

export async function confirmOAuthController(req, res) {
  const { code } = req.body;
  const session = await loginOrRegisterWithGoogle(code);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.send({
    status: 200,
    message: 'Login with google completed',
    data: {
      accessToken: session.accessToken,
    },
  });
}
//cookie parser and bcrypt session
