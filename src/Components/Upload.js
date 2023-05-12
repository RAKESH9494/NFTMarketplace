  import React, { useEffect, useState } from 'react'
  import axios from 'axios';
  import Web3 from 'web3';
  import { create } from 'ipfs-http-client';
  import { connect } from 'react-redux';
  const Upload = ({contract}) => {
    const [file,setFile] = useState(false);
    const [Hash,SetHash] = useState();
    const [status,setStatus] = useState("  ");
    const [nftPrice,setNftPrice] = useState();
    useEffect(()=>{
        const fileUpload = async(e)=>{
          try{
            if(file){
              const formData = new FormData();
              formData.append("file",file);
              const redFile = await axios({
                method:"post",
                url:'https://api.pinata.cloud/pinning/pinFileToIPFS',
                data:formData,
                headers:{
                  pinata_api_key :'083021bed9196ee492fb',
                  pinata_secret_api_key:'20029cbf5256b34d930b7719a20e72752f36234ab3a5b222d38b80b4bccd5e73',
                  "Content-Type":"multipart/form-data",
                }
              });
              const ImgHash =`https://ipfs.io/ipfs/${redFile.data.IpfsHash}`;
              setStatus("");
              SetHash(ImgHash);
            }}catch(e){
            setStatus("Unable to upload try again");
            console.log(e)
          }
        }
        const hand = async(e) =>{
          const res = await contract.methods.getNFTPrice().call();
          console.log(res); 
          setNftPrice(res);
        } 
        contract && hand();
        file && fileUpload();
        console.log(Web3.utils.toWei('0.01', 'ether'))
    },[file,contract])
    const FileHandler = async(e) =>{
      setStatus("Please Wait ....")
      const data = e.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(data);
      reader.onloadend = () =>{
        setFile(e.target.files[0]);
      };

    }
    async function uploadMetaData() {
      const NFTName = document.querySelector("#name").value;
      const NFTDescription = document.querySelector("#Des").value;
      const NFT_price = document.querySelector("#price").value;
      const JSONFile = {
          NFTName,NFTDescription,NFT_price,image : Hash
      };
      try {
        const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', JSONFile, {
          headers: {
            pinata_api_key: '083021bed9196ee492fb',
            pinata_secret_api_key: '20029cbf5256b34d930b7719a20e72752f36234ab3a5b222d38b80b4bccd5e73',
          },
        });
    
        if (response.status === 200) {
          console.log('File uploaded to Pinata successfully');
          const MetaHash =`https://ipfs.io/ipfs/${response.data.IpfsHash}`;
          return MetaHash;
        } else {
          console.log('Error uploading file to Pinata');
        }
      } catch (error) {
        console.error('Error uploading file to Pinata:', error);
      }
    } 
    const submithandler =async(e)=>{
      e.preventDefault();
      const NFT_price = document.querySelector("#price").value;
      const MetaDataURL = await uploadMetaData();
      try{
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        const transaction = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: account,
              to: contract.options.address,
              value:Web3.utils.toHex(Web3.utils.toWei('0.01', 'ether')),
              data: contract.methods.createNFTToken(MetaDataURL,Web3.utils.toHex(Web3.utils.toWei(NFT_price, 'ether'))).encodeABI()
            }
          ]
        });
        alert("NFT posted")
      }catch(e){
        alert(e.message);
      }
    }
    return (  
      <div> 
        <div class="header">
          <a href="#default" class="logo">NFTMarketplace</a>
          <div class="header-right1">
            <a href="/Home/Profile">PROFILE</a>
            <a href="/Home/Upload">UPLOAD</a>
            <a href="/Home" >LIVE</a>
          </div>
        </div>
        <div class="upload-body">
          <center>
            <div class="upload-form">
              <h3>Upload NFT</h3>
              <form class="form-group" onSubmit={submithandler}>
                <label>Name</label>
                <input type="text" className='form-control' id="name"/><br/>
                <label>Description</label>
                <textarea class="form-control" id="Des"></textarea><br/>
                <label>Price</label><br/>
                <input type="text" className='form-control' id="price"/><br/>
                <label >Image</label><br/>
                <input type="file" onChange={FileHandler} id="f1"/><br/><br/>
                <p>{status}</p>
                <input type='submit'/>
              </form>
            </div>
          </center>
        </div>  
      </div>
    )
  }
  const mapStateToProps = state=>({
    contract : state.abireducer.payload
    // account : state.addressreducer.payload
  })
  export default connect(mapStateToProps)(Upload) ;
