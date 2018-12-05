
import asyncWrap from 'express-async-wrapper';
import { decodeSession } from '../lib/users';
import User from '../models/user';
import { userStatus } from '../lib/enums'
import { Web3Client } from '../lib/web3Client'

const config = require('../../config/defaults.json');
const provider = config.network.provider;
const epedigreeAbi = require(config.network.abi_path);
const contractAddress = config.network.contractAddress;

export const unlockWeb3 = () => asyncWrap(async (req, res, next) => {
  try {
    if (req.user) {
      console.log(`unlocking account: ${req.user.walletAddress}`);
      const isAccUnlocked = req.web3Client.unlockAccount(req.user.walletAddress, req.user.walletPassword);
      console.log(isAccUnlocked);
      if (!isAccUnlocked) {
        throw new Error("Account unlock failed.");
      }
    }
    return next();
  } catch (error) {
    throw error;
  }
});

export const fetchSession = asyncWrap(async (req, res, next) => {
  let authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) return next();
  authorizationHeader = authorizationHeader.split(' ');
  if (authorizationHeader.length !== 2) throw new Error('Invalid Authorization Token');
  const userId = decodeSession(authorizationHeader[1]);
  if (userId) {
    const client = new Web3Client();
    req.user = await User.findById(userId);
    client.getWeb3Client(provider, req.user.walletAddress, req.user.walletPassword, req.user);
    client.connectToContract(provider, epedigreeAbi, contractAddress);
    req.web3Client = client;
  }
  return next();
});

export const requireUser = (role = null) => asyncWrap(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Could not authenticate user');
  }
  if (req.user.userStatus !== userStatus.active) {
    res.status(401);
    throw new Error("User account is not activated. Contact admin.");
  }
  if (role && req.user.role !== role) {
    res.status(401);
    throw new Error('Could not authenticate user (invalid permissions)');
  }
  return next();
});
