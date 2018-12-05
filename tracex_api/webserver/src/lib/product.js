import { getUsersWithWalletAddress } from './users'
import { productStatusMap } from '../lib/enums'
export const addProduct = async ({ name, description, units }, fromAddress, web3Client) => {
  const transfer = await web3Client.epedigreeContract.addProduct(name, description, units, { gas: 280000, from: fromAddress });
  return transfer;
};

export const getProductByID = async (productId, web3Client) => {
  /**
   * productidmapping[product_id].name,
   * productidmapping[product_id].desc,
   * productidmapping[product_id].pid,
   * productidmapping[product_id].units,
   * productidmapping[product_id].currentowner,
   * productidmapping[product_id].previousowner,
   * productidmapping[product_id].status
   */
  let product = await web3Client.epedigreeContract.getProductByID(productId);
  let walletAddresses = [];
  let walletUserMap = {};
  const productInfo = {};
  if(product && product[0]) {
    productInfo['name'] = product[0];
    productInfo['description'] = product[1];
    productInfo['id'] = product[2];
    productInfo['units'] = product[3];
    walletAddresses.push(product[4]);
    walletAddresses.push(product[5]);
    let walletToUserMap = getUsersWithWalletAddress(walletAddresses);
    productInfo['product_status'] = productStatusMap[product[6]];
    productInfo['currentOwner'] = walletToUserMap[product[4]];
    productInfo['previousOwner'] = walletToUserMap[product[5]];
    return productInfo;
  } else {
    throw new Error(`Product details with id: ${productId} not found`);
  }
}

export const getProductsByUser = async (account, web3Client) => {
  try {
    let products = await web3Client.epedigreeContract.getProductsByUser({ from: account });
    let productIds = products.toString().split(',');
    let productsInfo = [];
    productIds.map((productId) => {
      productsInfo.push(getProductByID(parseInt(productId), web3Client));
    });
    return productsInfo;
  } catch (error) {
    throw error;
  }
}
