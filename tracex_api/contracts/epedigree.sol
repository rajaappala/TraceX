pragma solidity ^0.4.2;
/*
    Owned contract interface
*/
import './Owned.sol';

import './strings.sol';
import './stringUtils.sol';
contract Epedigree is Owned {
    event track(uint indexed productId, address indexed from, address indexed to, uint timestamp, string status);
    event status(uint indexed statusCode, string msg);
    uint256 productcount;
    uint256 usercount;
    function Epedigree() {
        userIndex[++usercount] = User("ggktech", owner, "admin@ggktech.com", userCategeory.Admin, userStatus.Active, now);
        userAddressIndex[owner] = usercount;
        emailIndex["admin@ggktech.com"] = usercount;
    }

    enum userStatus { Inactive, Active }
    enum productStatus { Pending, Owned }
    enum userCategeory { Admin, Manufacturer,Warehouse, Distributor, Retailer }

    struct User {
        string name;
        address account;
        string email;
        userCategeory category;
        userStatus status;
        uint dateAdded;
    }

    mapping(uint => User) userIndex;
    mapping(string => uint) emailIndex;
    mapping(address => uint)  userAddressIndex;

    modifier manufacturerOnly {
        require(userIndex[userAddressIndex[msg.sender]].category == userCategeory.Manufacturer);
        _;
    }
    modifier onlyAdmin {
        require(userIndex[userAddressIndex[msg.sender]].category == userCategeory.Admin);
        _;
    }
    modifier activeUser {
        require(userIndex[userAddressIndex[msg.sender]].status == userStatus.Active);
        _;
    }

    struct product {
        string name;
        string desc;
        uint256 pid;
        address currentowner;
        address previousowner;
        productStatus status;
        uint256 units;
    }
    mapping(uint256 => product) public productidmapping;
    mapping(address => uint256[]) public productidadressmapping;

    function addProduct(string name, string desc, uint256 units) manufacturerOnly activeUser public returns(uint) {
        productcount++;
        productidmapping[productcount] = product(name, desc, productcount, msg.sender, msg.sender, productStatus.Owned, units);
        productidadressmapping[msg.sender].push(productcount);
        return productcount;
    }

    function transferProduct(uint pid, address des) activeUser public {
        require(userAddressIndex[des] > 0 && (productidmapping[pid].previousowner == productidmapping[pid].currentowner) && (productidmapping[pid].previousowner == msg.sender));
        require(uint(userIndex[userAddressIndex[des]].category) - 1 == uint(userIndex[userAddressIndex[productidmapping[pid].currentowner]].category));
        // productidmapping[pid].previousowner = productidmapping[pid].currentowner;
        productidmapping[pid].currentowner = des;
        productidmapping[pid].status = productStatus.Pending;
        track(pid, msg.sender, des, now, "sent");
    }

    function receiveProduct(uint pid) activeUser  public {
        require(verifyProduct(pid));
        productidmapping[pid].status = productStatus.Owned;
        productidadressmapping[msg.sender].push(pid);
        track(pid, productidmapping[pid].previousowner, msg.sender, now, "received");
    }

    function notReceivedProduct(uint pid) activeUser  public {
        require(verifyProduct(pid));
        productidmapping[pid].currentowner = productidmapping[pid].previousowner;
        productidmapping[pid].status = productStatus.Owned;
        track(pid, productidmapping[pid].previousowner, msg.sender, now, "not received");
    }
    function verifyProduct(uint pid) constant returns(bool) {
        return productidmapping[pid].currentowner == msg.sender;
    }

    function addUser(string name, address account, string email, string categeory) public returns(uint) {

        var user_Index = userAddressIndex[account];
        var email_Index = emailIndex[email];
        if (user_Index == email_Index && user_Index != 0) {
            status(400, "Already registered");
            return;
        }
        if (user_Index != 0 && email_Index != 0 && email_Index != user_Index) {
            status(400, "already registered but with different users");
            return;
        }
        if (user_Index == 0 && email_Index != 0) {
            status(400, "email is already registered");
            return;
        }
        if (user_Index != 0 && email_Index == 0) {
            status(400, "account is already registered");
            return;
        }
        if (strings.equals(strings.toSlice(categeory), strings.toSlice("Manufacturer"))) {
            userIndex[++usercount] = User(name, account, email, userCategeory.Manufacturer, userStatus.Active, now);
        } else if (strings.equals(strings.toSlice(categeory), strings.toSlice("Retailer"))) {
            userIndex[++usercount] = User(name, account, email, userCategeory.Retailer, userStatus.Active, now);
        } else if (strings.equals(strings.toSlice(categeory), strings.toSlice("Distributor"))) {
            userIndex[++usercount] = User(name, account, email, userCategeory.Distributor, userStatus.Active, now);
        } else if (strings.equals(strings.toSlice(categeory), strings.toSlice("Warehouse"))) {
            userIndex[++usercount] = User(name, account, email, userCategeory.Warehouse, userStatus.Active, now);
        } else if (strings.equals(strings.toSlice(categeory), strings.toSlice("Admin"))) {
            require(msg.sender == owner);
            userIndex[++usercount] = User(name, account, email, userCategeory.Admin, userStatus.Active, now);
        } else {
            return;
        }
        userAddressIndex[account] = usercount;
        emailIndex[email] = usercount;
        status(200, "User created successfully");
        return usercount;
    }

    function getUsersCount() constant returns(uint256) {
        return usercount;
    }


    function getUserDetailsByAccount(address account) constant returns(uint256, string, address, string, userStatus, userCategeory, uint) {
        var i = userAddressIndex[account];
        if (i != 0) {
            return (i, userIndex[i].name, userIndex[i].account, userIndex[i].email, userIndex[i].status, userIndex[i].category, userIndex[i].dateAdded);
        }
    }

    function getUserrDetailsByEmail(string email) constant returns(uint256, string, address, string, userStatus, userCategeory, uint) {
        var i = emailIndex[email];
        if (i != 0) {
            return (i, userIndex[i].name, userIndex[i].account, userIndex[i].email, userIndex[i].status, userIndex[i].category, userIndex[i].dateAdded);
        }
    }

    function getUserDetailsByIndex(uint i) constant returns(string, address, string, userStatus, userCategeory, uint) {
        if (i < 1 || i > usercount) {
            return;
        }
        return (userIndex[i].name, userIndex[i].account, userIndex[i].email, userIndex[i].status, userIndex[i].category, userIndex[i].dateAdded);
    }

    function getProductByID(uint256 product_id) constant returns(string, string, uint256, uint256 , address, address, productStatus) {
        return (productidmapping[product_id].name, productidmapping[product_id].desc, productidmapping[product_id].pid, productidmapping[product_id].units,productidmapping[product_id].currentowner,productidmapping[product_id].previousowner,productidmapping[product_id].status);
    }

    function getProductsByUser() constant manufacturerOnly returns(uint256[]) {
        return productidadressmapping[msg.sender];
    }
}
