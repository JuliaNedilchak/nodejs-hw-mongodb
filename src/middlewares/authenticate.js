import createHttpError from 'http-errors';
import { Session } from '../db/session.js';
import { User } from '../db/user.js';

export async function auth(req, res, next) {
  console.log(req.headers);
  const { authorization } = req.headers;
  if (typeof authorization !== 'string') {
    return next(createHttpError(401, 'please provide authorization header'));
  }
  const [bearer, accessToken] = authorization.split(' ', 2);
  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(createHttpError(401, 'Auth header should be type of Bearer'));
  }
  const session = await Session.findOne({ accessToken });
  if (session === null) {
    return next(createHttpError(401, 'session is not found'));
  }
  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'access token is expired'));
  }

  const user = await User.findById(session.userId);

  if (user === null) {
    return next(createHttpError(401, 'Session not found'));
  }
  req.user = user;

  next();
}
//throw ? next?
