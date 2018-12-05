
let enums = {
  userCategory: Object.freeze({
    "admin": "Admin",
    "manufacturer": "Manufacturer",
    "warehouse": "Warehouse",
    "retailer": "Retailer",
    "distributor": "Distributor",

  }),
  userCategoryMap: Object.freeze({
    "1": "Admin",
    "2": "Manufacturer",
    "3": "Warehouse",
    "4": "Distributor",
    "5": "Retailer"
  }),
  userStatus: Object.freeze({
    "inactive": "Inactive",
    "rejected": "Rejected",
    "pending": "Pending",
    "emailVerified": "EmailVerified",
    "active": "Active"
  }),
  userStatusMap: Object.freeze({
    "1": "Inactive",
    "2": "Rejected",
    "3": "Pending",
    "4": "EmailVerified",
    "5": "Active"
  }),
  productStatusMap: Object.freeze({
    "1": "Pending",
    "2": "Owned"
  })
};

module.exports = enums;
