import React, { useEffect, useState } from 'react'
import "./Styles.css"
import Web3 from 'web3'
import { connect } from 'react-redux'
import axios from 'axios'
const Home = ({contract}) => {
  const [data,setData] = useState([])
  const [Account,setAccont] = useState();
  useEffect(() => {
    const getData = async () => {
          const res = await contract.methods.getAllNFTs().call();
          try{
          const nfts = await Promise.all(res.map(async (i) => {
            const tokenURI = await contract.methods.getTokenURI(i.tokenId).call();
            const metadataResponse = await axios.get(tokenURI);
            const metadata = metadataResponse.data;
            const price = Web3.utils.fromWei(i.price.toString(), 'ether');
            const item = {
              price,
              tokenId: i.tokenId,
              seller: i.seller,
              owner: i.owner,
              image: metadata.image,
              name: metadata.NFTName,
              description: metadata.NFTDescription
            };
            console.log(item)
            return item;
          }));
          console.log(nfts);
          setData(nfts);
        }catch(e){
          console.log(e)
        }
        }
    const getAccount = async(e)=>{
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccont(accounts[0])
    };
    contract && getAccount();  
    contract && getData();
  }, [contract]);
  const buynft = async(e,id,price)=>{
    e.preventDefault()
    try{
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      const transaction = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from:account,
            to: contract.options.address,
            value:Web3.utils.toHex(Web3.utils.toWei(price, 'ether')),
            data: contract.methods.SaleNFT(id).encodeABI()
          }
        ]
      });
      alert("Buyd Successfull")
    }catch(e){
      alert(e.message);
    }
  }
  
  return (
    <div>
        <div class="header">
            <a href="#default" class="logo">NFTMarketplace</a>
            <div class="header-right1">
            <a href="/">LOGOUT</a>
                <a href="/Home/Profile">PROFILE</a>
                <a href="/Home/Upload" >UPLOAD</a>
                <a href="/Home" >LIVE</a>
            </div>
        </div>
        <div class="NFT-outer">
          <h3>NFTS LIVE NOW..</h3>
          <div class="NFT-inner">
          {data.length !==0 ? data.map((value, index) => (
              <div className="NFT-item" key={index}>
                <div className="nft-body">
                  <div className="nft-container">
                    <img src={value.image} alt="NFT" width={"200px"} height={"290px"}/>
                  </div>
                  <p class="add">NFT NAME : {value.name}</p>
                  <p class="add">Owner  {value.owner}</p>
                  <p>Price: {value.price}</p>
                  <center>
                    <button onClick={(e)=>buynft(e,value.tokenId,value.price)}>BUY</button>
                  </center>
                </div>
              </div>
            )):<h2 style={{"textAlign":"center"}}>No NFTs uploaded yet..</h2>}
          </div>
        </div>
    </div>
  )
}
const mapStateToProps = state =>({
  contract : state.abireducer.payload
})
export default connect(mapStateToProps)(Home)