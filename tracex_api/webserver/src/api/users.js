/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

import { Router } from 'express';
import asyncWrap from 'express-async-wrapper';
import {
  fetchSession,
  requireUser,
  unlockWeb3
} from '../middleware/users';
import { userCategory, userStatus } from '../lib/enums';
import {
  signup,
  authenticate,
  encodeSession,
  exportSafeUser,
  forgotPassword,
  resetPassword,
  requireRole,
  approveSingup,
  getUserFromBlockChain
} from '../lib/users';
import User from '../models/user';
import web3 from '../lib/web3Client';

export default ({ config, db }) => {
  const api = Router();

  // Create user (signup)
  api.post('/', asyncWrap(async (req, res) => {
    try {
      const rawUser = await signup(req.body);
      const user = exportSafeUser(rawUser);
      res.json({ result: user });
    } catch (error) {
      res.status(400);
      throw error;
    }
  }));

  // Create session (login)
  api.post('/sessions', asyncWrap(async (req, res) => {
    try {
      const rawUser = await authenticate(req.body.email, req.body.password);
      const token = encodeSession(rawUser._id);
      const user = exportSafeUser(rawUser);
      return res.json({ result: { user, token } });
    } catch (error) {
      console.error(error);
      res.status(401);
      throw error;
    }
  }));

  // Get self (user info)
  api.get('/self', requireUser(), (req, res) => {
    const user = exportSafeUser(req.user, true);
    res.json({ result: user });
  });

  // Update self (user profile)
  api.post('/self', requireUser(), asyncWrap(async (req, res) => {
    ['name'].forEach((validField) => {
      if (req.body[validField]) {
        req.user[validField] = req.body[validField];
      }
    });
    await req.user.save();
    const user = exportSafeUser(req.user);
    res.json({ result: user });
  }));

  // Delete self (user profile)
  api.delete('/self', requireUser(), asyncWrap(async (req, res) => {
    await req.user.remove();
    res.json({ result: { success: true } });
  }));

  // Admin list users
  api.get('/', requireUser(userCategory.admin), asyncWrap(async (req, res) => {
    const status = req.query.status;
    let rawUsers;
    if (status && Object.values(userStatus).includes(status)) {
      rawUsers = await User.find({ userStatus: status });
    } else {
      rawUsers = await User.find();
    }
    const users = rawUsers.map(user => exportSafeUser(user));
    res.json({ result: users });
  }));

  // Admin get user
  api.get('/:id', requireUser(userCategory.admin), asyncWrap(async (req, res) => {
    const rawUser = await User.findById(req.params.id);
    const user = exportSafeUser(rawUser);
    res.json({ result: user });
  }));

  // Admin delete user
  api.delete('/:id', requireUser(userCategory.admin), asyncWrap(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error('No such user');
    await user.remove();
    return res.json({ result: { success: true } });
  }));

  // Admin update user
  api.post('/:id', requireUser(userCategory.admin), asyncWrap(async (req, res) => {
    const rawUser = await User.findById(req.params.id);
    if (!rawUser) throw new Error('No such user');
    rawUser.set(req.body);
    await rawUser.save();
    const user = exportSafeUser(rawUser);
    return res.json({ result: user });
  }));

  api.post('/:id/approve_signup', [requireUser(userCategory.admin), unlockWeb3()], asyncWrap(async (req, res) => {
    try {
      let rawUser = await User.findById(req.params.id);
      if (!rawUser) throw new Error('No such user');
      const web3Client = req.web3Client;
      let user = await approveSingup(rawUser, req.user.walletAddress, web3Client);
      user = exportSafeUser(rawUser);
      delete req.web3Client;
      return res.json({ result: user });
    } catch (error) {
      console.error(error);
      res.status(500);
      throw error;
    }
  }));

  api.post('/:id/reject_signup', requireUser(userCategory.admin), asyncWrap(async (req, res) => {
    try {
      let rawUser = await User.findById(req.params.id);
      if (!rawUser) throw new Error('No such user');
      if (rawUser.userStatus === userStatus.active) {
        throw new Error("Cannot reject already approved singup request.");
      }
      rawUser.userStatus = userStatus.rejected;
      rawUser.save();
      return res.json({ result: exportSafeUser(rawUser) });
    } catch (error) {
      console.error(error);
      res.status(500);
      throw error;
    }
  }));

  api.post('/:id/verify_email', asyncWrap(async (req, res) => {
    try {
      let rawUser = await User.findById(req.params.id);
      if (!rawUser) throw new Error('No such user');
      rawUser.userStatus = userStatus.emailVerified;
      rawUser.save();
      let user = exportSafeUser(rawUser);
      return res.json({ result: user });
    } catch (error) {
      console.error(error);
      res.status(500);
      throw error;
    }
  }));

  api.get('/:id/blockchain_data', requireUser(), asyncWrap(async (req, res) => {
    const userInfo = getUserFromBlockChain(req.user.walletAddress, req.web3Client);
    return res.json({ result: userInfo });
  }));

  // Forgot Password (get token)
  api.post('/password/forgot', asyncWrap(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new Error('No email given');
    const user = await User.findOne({ email });
    if (!user) throw new Error('No user by that email found');
    const resetPasswordToken = await forgotPassword(user);
    return res.json({ result: { resetPasswordToken } });
  }));

  // Reset Password (use token to reset)
  api.post('/password/reset', asyncWrap(async (req, res) => {
    const { email, resetPasswordToken, newPassword } = req.body;
    if (!email) throw new Error('No email given');
    const user = await User.findOne({ email });
    if (!user) throw new Error('No user by that email found');
    await resetPassword(user, resetPasswordToken, newPassword);
    return res.json({ result: { success: true } });
  }));

  // get_by_role users
  api.get('/get_by_role', requireUser(), asyncWrap(async (req, res) => {
    const role = req.query.role;
    let rawUsers;
    if (role && Object.values(userCategory).includes(role)) {
      rawUsers = await User.find({ userStatus: userStatus.active, role: role });
      const users = rawUsers.map(user => exportSafeUser(user));
      res.json({ result: users });
    } else {
      res.status(400);
      res.json({ error: "role query parameter is required." });
    }
  }));

  return api;
};
