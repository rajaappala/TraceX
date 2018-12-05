import { Router } from 'express';
import asyncWrap from 'express-async-wrapper';
import { userCategory } from '../lib/enums';
import {
  fetchSession,
  requireUser,
  unlockWeb3
} from '../middleware/users';
import {
  addProduct,
  getProductsByUser,
  getProductByID
} from '../lib/product';

export default ({ config, db }) => {
  const api = Router();

  api.use(fetchSession);

  /**
   * create product
   */
  api.post('/', [requireUser(userCategory.manufacturer), unlockWeb3()], asyncWrap(async (req, res) => {
    ['name', 'description', 'units'].forEach((validField) => {
      if (!req.body[validField]) {
        res.status(400);
        throw new Error(`${validField} is required.`);
      }
    });
    try {
      console.log(`Creating product ${JSON.stringify(req.body)} for account: ${req.user.walletAddress}`);
      let product = Object.assign({}, req.body);
      let productReceipt = await addProduct(product, req.user.walletAddress, req.web3Client);
      console.log(productReceipt);
      res.send({ result: productReceipt });
    } catch (error) {
      console.error(error);
      res.status(500);
      throw error;
    }
  }));

  api.get('/:id/track', requireUser(), asyncWrap(async (req, res) => {
    const productid = req.params.id;
    if (!productid) {
      return next({ 'message': `product id  ${productid} is invalid` });
    }
    req.web3Client.epedigreeContract.track({ productid }, {
      fromBlock: 0,
      toBlock: 'latest'
    }, (e, result) => {
      if (e) {
        return next({ 'message': `error in fetching event` });
      } else {
        res.send({ result: result });
      }
    });
  }));

  api.get('/', requireUser(), asyncWrap(async (req, res) => {
    try {
      debugger;
      console.log(`getting products of ${req.user.name}`);
      const products = await getProductsByUser(req.user.walletAddress, req.web3Client);
      return products;
    } catch (error) {
      throw error;
    }
  }));

  return api;
};
