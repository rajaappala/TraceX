const enums = require('../../lib/enums');
// const web3 = require('../web3Client');
const client = require('../web3helper');

let addUserTest = async () => {
  const account = await web3.createAccount();
  let email = 'test@test.com';
  let count = await web3.getUsersCount();
  console.log(count);
  // let res = await web3.addUser('test', account.address, email, enums.userCategory.manufacturer);
  // let user = web3.getUserDetailsByEmail(email);
}

// addUserTest();

let test = async () => {
  // const account = await client.createAccount();
  // console.log(JSON.stringify(account));
  // const user = 
  client.epedigree.getUsersCount().then((res) => {
    console.log(res.toString(10));
  });
}

test();
