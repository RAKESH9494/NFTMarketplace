import React, { useEffect } from 'react'
import Home from './Components/Home'
import Login from './Components/Login'
import Upload from './Components/Upload'
import Profile from './Components/Profile'
import Web3 from 'web3'
import { setContract } from './StateValues/actions'
import abi from './artifacts/contracts/NFTMarketPlace.sol/NFTMarketPlace.json'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { connect } from 'react-redux'
const App =({setContract}) =>{
  useEffect(()=>{
    const getContract = async(e)=>{
      if (window.ethereum) {
        const { ethereum } = window;
        const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        const contractABI = abi.abi;
        try {
          const provider = new Web3.providers.HttpProvider('http://localhost:8545');
          const web3 = new Web3(provider);
          const contract = new web3.eth.Contract(contractABI, contractAddress);
          setContract(contract);
        } catch (e) {
          console.log(e);
        }
      } else {
      alert('Install Metamask');
      }
    }
    getContract();
  },[])
  return (
    <div >
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/Home" element={<Home/>}/>
        <Route path="/Home/Upload" element={<Upload/>}/>        
        <Route path="/Home/Profile" element={<Profile/>}/>
      </Routes>
      </BrowserRouter>
    </div>    
  )
}
const mapStateToProps = state=>({

})
export default connect(mapStateToProps,{setContract})(App)