
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import User from '../models/user';
import { userCategory, userStatus } from '../lib/enums'
import { client } from './web3Client'

require('babel-core/register');
require('babel-polyfill');

const BCRYPT_SALT_ROUNDS = 10;
const JWT_SECRET = 'dnu34idf43jqw723p00djkdop';

export const signup = async ({
  username,
  email,
  password,
  passwordRepeat,
  name,
  role,
}) => {
  // Create user object canidate
  const user = new User({
    username, email, name,
  });

  // Check if user is unique
  if (await User.count({ email }) > 0) {
    throw new Error('User with that email already exists');
  }

  // Check if user is unique
  if (await User.count({ username }) > 0) {
    throw new Error('User with that username already exists');
  }

  // Check password and generate hash
  if (!password || !password.length) throw new Error('Expected password to not be blank');
  if (password !== passwordRepeat) throw new Error('Expected passwords to match');
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  user.hash = await bcrypt.hash(password, salt);
  user.walletPassword = password;
  user.role = role;

  // Save
  await user.save();

  return user;
};

export const authenticate = async (email, password) => {
  if (!email) throw new Error('Email cannot be blank');
  if (!password || !password.length) throw new Error('Password cannot be blank');
  const user = await User.findOne({ email });
  if (user) {
    if (user.userStatus != userStatus.active) {
      throw new Error("User signup is waiting for admin's approval.");
    }
    const comparison = await bcrypt.compare(password, user.hash);
    if (comparison === true) {
      return user;
    }
  }
  throw new Error('Incorrect email or password');
};

export const exportSafeUser = (user, isSelf = null) => {
  const object = user.toObject();
  delete object.hash;
  if (!isSelf) {
    delete object.walletPrivateKey;
    delete object.walletPassword;
  }
  return object;
};

export const encodeSession = userId => jwt.sign({ userId }, JWT_SECRET);

export const decodeSession = (token) => {
  const payload = jwt.verify(token, JWT_SECRET);
  if (!payload || !payload.userId) throw new Error('Invalid Token');
  return payload.userId;
};

export const hasRole = (user, role) => user.role === role;

export const requireRole = (user, role) => {
  if (!hasRole(user, role)) throw new Error('Permission denied');
};

export const forgotPassword = async (user) => {
  const hash = createHash('sha256');
  hash.update(`${user.email}-${user.name}-${Date.now()}`);
  const resetPasswordToken = hash.digest('hex');
  user.set({ resetPasswordToken });
  await user.save();
  return resetPasswordToken;
};

export const setPassword = async (user, newPassword) => {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  const hash = await bcrypt.hash(newPassword, salt);
  user.set({ hash });
  await user.save();
};

export const resetPassword = async (user, resetPasswordToken, newPassword) => {
  if (!user.resetPasswordToken || user.resetPasswordToken !== resetPasswordToken) {
    throw new Error('Invalid reset password token given, could not reset password');
  }
  await setPassword(user, newPassword);
};

export const approveSingup = async (rawUser, accountAddress, web3Client) => {
  try {
    let account = await web3Client.createAccount(rawUser.walletPassword);
    console.log(`account: ${account}`);
    console.debug("create a user in blockchain");
    const res = await web3Client.epedigreeContract.addUser(
      rawUser.name,
      account,
      rawUser.email,
      rawUser.role,
      { gas: 2800000, from: accountAddress }
    );
    console.debug("get created user from blockchain");
    const userInfo = await web3Client.epedigreeContract.getUserrDetailsByEmail(rawUser.email);
    if (userInfo && userInfo[0].toString() === "0") {
      throw new Error("User details not found in blockchain");
    }
    console.debug(`userInfo : ${userInfo.toString()}`);
    const bUserId = parseInt(userInfo[0].toString());
    rawUser.walletAddress = account;
    rawUser.walletPrivateKey = account.privateKey;
    rawUser.bUserId = bUserId;
    rawUser.userStatus = userStatus.active;
    return rawUser.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserFromBlockChain = async (account, web3Client) => {
  try {
    const userFromBlockChain = await web3Client.epedigreeContract.getUserDetailsByAccount(account);
    return userFromBlockChain;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUsersWithWalletAddress = async(walletAddresses) => {
  debugger;
  let users = await User.find({"walletAddress": {$in: walletAddresses}});
  let walletUserMap = {};
  users.map((user) => {
    walletUserMap[user.walletAddress] = user;
  })
  return walletUserMap;
}
