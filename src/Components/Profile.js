import React, { useEffect, useState } from 'react'
import "./Styles.css"
import Web3 from 'web3'
import { connect } from 'react-redux'
import axios from 'axios'
const Profile= ({contract}) => {
  const [data,setData] = useState([]);
  const [Account,setAccount] = useState();
  useEffect(() => {
    const getData = async () => {  
        try{
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const res = await contract.methods.getMyNFTs(accounts[0]).call();
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
             return item;
        }));
        setData(nfts);
        console.log(nfts)
      }catch(e){
        console.log(e)
      }
      }
     contract && getData();
  }, [contract]);
  useEffect(() => {
    console.log(data);
  }, [data]);  
  
  return (
    <div>
        <div class="header">
            <a href="#default" class="logo">NFTMarketplace</a>
            <div class="header-right1">
                <a href="/Home/Profile">PROFILE</a>
                <a href="/Home/Upload" >UPLOAD</a>
                <a href="/Home" >LIVE</a>
            </div>
        </div>
        <div class="NFT-outer">
          <h3>MY NFTs</h3>
          <div class="NFT-inner">
          {data && data.map((value, index) => (
              <div className="NFT-item" key={index}>
                <div className="nft-body">
                  <div className="nft-container">
                    <img src={value.image} alt="NFT" width={"200px"} height={"290px"}/>
                  </div>
                  <p class="add">NFT NAME : {value.name}</p>
                  <p>Price: {value.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}
const mapStateToProps = state =>({
  contract : state.abireducer.payload,
})
export default connect(mapStateToProps)(Profile)