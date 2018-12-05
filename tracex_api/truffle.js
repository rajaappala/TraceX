module.exports = {
    networks: {
        development: {
            host: '10.218.0.19',
            port: 8545,
            gas: 4700000,
            from: "0x09bCaF906d86b976ebE02f42C860022BE0182821",
            network_id: '*' // Match any network id	
        }
    }
}