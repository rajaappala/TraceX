# TraceX
##### Tracex Application setup

### API setup
- Deploying contracts
  - Prerequisites:
    - install go-ethereum
        ```
        $ sudo apt-get install software-properties-common
        $ sudo add-apt-repository -y ppa:ethereum/ethereum
        $ sudo apt update
        $ sudo apt-get install ethereum
        ```
    - install node@8.11.2
        ```
        $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
        $ nvm install 8.11.2
        ```
    - install truffle
        `npm install -g truffle`
  - run ethereum node in local to connect to the network
    ```
    geth --testnet --syncmode "fast" --rpc --rpcapi db,eth,net,web3,personal --cache=1024 --rpcport 8545 --rpcaddr 127.0.0.1 --rpccorsdomain "*"
    ```
    please replace 127.0.0.1 with your IP.
    
    After network is synched, goto tracex_api folder and run `truffle console`.
    
    create an eth account -> `web3.personal.newAccount('verystrongpassword')`.
    
    above command will give a public address, please send some faucets(test ethers) to that account.
    
    unlock the account -> `web3.personal.unlockAccount('XXXXXXXXX public address', 'verystrongpassword', 15000)`
    
    come out of the console and compile the contracts -> `truffle compile`
    
    deploy the contract -> `truffle migrate`(before doing this, please goto TraceX/tracex_api/truffle.js file and update host and from with your own IP and public address you created and unlocked).
    
    with this you contract will be dployed to ethereum testnet and you will get a contract address.
    
- Spin up the Mongo Database -> `docker-compose up -d`
- Spin up the API(webserver)
  - Goto TraceX/tracex_api/webserver/config/defaults.json and update the details like contract address and deployer public address and remaining as required.
  - goto terminal and run
    ```
    nvm use 8.11.2
    npm install
    npm run dev
    ```
### UI Setup
 - Goto TraceX/tracex_ui/src/app/app.config.ts and update API url.
 - Run the following commands
    ```
    nvm use 8.11.2
    npm install
    npm run start
    ```
