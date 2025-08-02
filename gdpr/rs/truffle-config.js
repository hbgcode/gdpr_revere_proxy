const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "/build"),
  networks: {
    development: {
      //host: "127.0.0.1",
      host: "14.139.197.66",
      port: 7545,
      network_id: "5777" //Match any network id
    }
  }
};

