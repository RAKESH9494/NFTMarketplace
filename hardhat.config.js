require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork:"hardhat",
  networks :{
    hardhat:{}
  },
  paths :{
    artifacts:"./src/artifacts",
  },
};

// module.exports = {
//   solidity: "0.8.17",
//   networks :{
//     hardhat:{},
//     polygon_mumbai:{
//       url:"https://polygon-mumbai.g.alchemy.com/v2/sFTs8ctdY00R0WTl1mmZqZI55mTaFtlW",
//       accounts : [`0x${"0838437cb847b33d7c3e9fa2edb375054cc22a85adc38bd30fdcb7e8649daaa9"}`]
//     },
//   },
//   paths :{
//     artifacts:"./src/artifacts",
//   },
// };