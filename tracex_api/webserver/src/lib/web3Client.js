import { resolve } from 'url';
const Web3 = require('web3');
const Web3EthPersonal = require('web3-eth-personal');
const truffleContract = require('truffle-contract');

const config = require('../../config/defaults.json');

let Web3Client = class {
  constructor() {
    this.epedigreeContract;
    this.web3;
    this.web3EthPersonal;
    this.user;
  };

  getWeb3Client(providerHost, user) {
    // set the provider you want from Web3.providers
    const currentProvider = new Web3.providers.HttpProvider(providerHost);
    this.web3 = new Web3();
    this.web3.setProvider(currentProvider);
    this.web3EthPersonal = new Web3EthPersonal(providerHost);
    this.user = user;
    return this.web3;
  };

  unlockAccount(account, password, stayAliveTime = 100) {
    const isAccontUnlocked = this.web3.personal.unlockAccount(account, password, stayAliveTime);
    if(!isAccontUnlocked){
      throw new Error("Account unlock failed.");
    }
    return isAccontUnlocked;
  };

  /**
   * Creates a connection to the smart contract.
   * @param {* endpoint for provider} provider
   * @param {* Application Binary Interface path of the contract} contractABIPath
   * @param {* contract address} contractAddress
   */
  connectToContract(provider, contractABIPath, contractAddress) {
    let contract = truffleContract(contractABIPath);
    contract.setProvider(this.web3.currentProvider);
    this.epedigreeContract = contract.at(contractAddress);
    return this.epedigreeContract;
  };

  /**
   * Returns all the accounts.
   */
  getAllAccounts() {
    return new Promise((resolve, reject) => {
      let self = this;
      try {
        let users = self.web3.eth.accounts();
        return resolve(users);
      } catch (e) {
        console.error(e);
        return reject("Error fetching users from contact");
      }
    });
  };

  /**
   * Create an account in eth network.
   */
  createAccount(password) {
    return this.web3EthPersonal.newAccount(password);
  };

  estimateGas(method) {
    return new Promise((resolve, reject) => {
      let self = this;
      try {
        const estimatedGas = this.epedigreeContract[method].estimateGas();
        return resolve(estimatedGas);
      } catch (error) {
        console.error(`Error estimating gas for ${method}`);
        return reject(error);
      }
    });
  }

  // /**
  //  * Creates a user in blockchain app.
  //  * smart contract adduser args: (string name, address account, string email, string categeory)
  //  *
  //  * @param {*} name
  //  * @param {*} address
  //  * @param {*} email
  //  * @param {*} categeory
  //  */
  // addUser(name, address, email, role, userAddress) {
  //   let self = this;
  //   try {
  //     return self.epedigreeContract.addUser(name, address, email, role, {gas: 1000000, from: userAddress});
  //   } catch(e) {
  //     console.error("Error in adding new user");
  //     return reject(e);
  //   }
  // };

  // /**
  //  * updates user status to EmailVerified
  //  * @param {*} bUserId
  //  */
  // emailVerificationOfUser(bUserId) {
  //   return new Promise((resolve, reject) => {
  //     let self = this;
  //     try {
  //       const res = self.epedigreeContract.EmailVerificationOfUser(bUserId);
  //       console.log('res: ', res);
  //       return resolve(res);
  //     } catch (error) {
  //       console.error(error);
  //       return reject("Error verifying the user's email");
  //     }
  //   });
  // };

  // /**
  //  * updates user status to Active
  //  * @param {*} bUserId
  //  */
  // adminVerificationOfUser(bUserId) {
  //   return new Promise((resolve, reject) => {
  //     let self = this;
  //     try {
  //       const res = self.epedigreeContract.AdminVerificationOfUser(bUserId);
  //       console.log('res: ', res);
  //       return resolve(res);
  //     } catch (error) {
  //       console.error(error);
  //       return reject("Error updating the user status");
  //     }
  //   });
  // };

  // getUsersCount() {
  //   return new Promise((resolve, reject) => {
  //     let self = this;
  //     try {
  //       const res = self.epedigreeContract.getUsersCount();
  //       let test = res.call();
  //       return resolve(res);
  //     } catch (error) {
  //       console.error(error);
  //       return reject("Error updating the user status");
  //     }
  //   });
  // };

  // getUserDetailsByEmail(email) {
  //   return new Promise((resolve, reject) => {
  //     let self = this;
  //     try {
  //       return self.epedigreeContract.getUserrDetailsByEmail();
  //     } catch (error) {
  //       console.error('Error occurred is getting user details by email', error);
  //       throw error;
  //     }
  //   });
  // };
};

module.exports.Web3Client = Web3Client;
