
import nodeEnvConfiguration from 'node-env-configuration';
import { signup } from './users';
import configDefaults from '../../config/defaults.json';
import User from '../models/user';
import { userCategory, userStatus } from '../lib/enums'
import { Web3Client } from '../lib/web3Client'

const config = nodeEnvConfiguration({
  defaults: configDefaults,
  prefix: 'api',
});


const createUsers = async () => {
  const { admin } = config;
  const params = Object.assign({}, admin, { passwordRepeat: admin.password, role: userCategory.admin });
  if (await User.findOne({ email: params.email })) {
    return false;
  }
  const provider = config.network.provider;
  const epedigreeAbi = require(config.network.abi_path);
  const contractAddress = config.network.contractAddress;
  const client = new Web3Client();
  const web3 = client.getWeb3Client(provider, config.network.deployer, config.network.password);
  const epedigreeContract = client.connectToContract(provider, epedigreeAbi, contractAddress);
  //get admin user from smart contract.
  const bUser = await epedigreeContract.getUserrDetailsByEmail(params.email);
  if (bUser && bUser[0].toString === "0") {
    console.log('User details not found in blockchain');
    return false;
  }
  const adminUser = await signup(params);
  adminUser.userStatus = userStatus.active;
  adminUser.bUserId = bUser[0].toString();
  adminUser.walletAddress = bUser[2].toString();
  await adminUser.save();
  console.log(`Added admin user ${adminUser.email} to database`);
  return true;
};

export default async () => {
  await createUsers();
};
