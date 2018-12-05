
import { Router } from 'express';
import users from './users';
import products from './product';
import { version } from '../../package.json';
import { userCategory, userStatus } from '../lib/enums'
import { fetchSession } from '../middleware/users';

export default ({ config, db }) => {
  const api = Router();

  api.use(fetchSession);

  api.use('/v1/users', users({ config, db }));

  api.use('/v1/products', products({ config, db }));

  api.get('/', (req, res) => {
    const protocolVersion = v1;
    res.json({ version, protocolVersion });
  });

  api.get('/v1/roles', (req, res) => {
    res.json({result: Object.values(userCategory)});
  });

  api.get('/v1/userStatus', (req, res) => {
    res.json({result: Object.values(userStatus)});
  });

  // If no route is matched by now, it must be a 404
  api.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  return api;
};
