import React, { useEffect, useState } from 'react'
import "./Styles.css"
import Web3 from 'web3'
import { setOwner } from '../StateValues/actions';
import { setName } from '../StateValues/actions';
import { setContract } from '../StateValues/actions';
import { connect } from 'react-redux';  
import { useNavigate } from 'react-router-dom';
const Login = ({setOwner,setName}) =>{
    const navigate = useNavigate();
    const [buttonName,setButtonName] = useState("Connect Wallet");
    const [Account,setAccount] = useState();
    useEffect(()=>{
        if(typeof window.ethereum !=='undefined'){
        }
        else{
            alert("Metamask Not available")
        }

    },[])
    const handler = async(e)=>{
        e.preventDefault()
        if(window.ethereum){
             const {ethereum} = window
             const permissions = await ethereum.request({
                method: 'wallet_requestPermissions',
                params: [{
                    eth_accounts: {},
                  }]
                });
                window.ethereum.request({method:"eth_requestAccounts"}).then((accounts)=>{
                    setAccount(accounts[0]);
                })
                setButtonName("Connected");
                permissions();
            }
            else{
                alert("Install Metamask");
            }

        }
    const submitHandler = async(e)=>{
        e.preventDefault();
        const name = document.querySelector("#name").value;
        const address =Web3.utils.toChecksumAddress(Account.toLowerCase());
        setOwner(address)
        if(name!=null || address != null){
            setName(name);
            setOwner(address);
            navigate("/Home")
        }
    }
  return (
    <div>
        <div class="header">
            <a href="#default" class="logo">NFTMarketplace</a>
            <div class="header-right">
                <a href="#" onClick={handler} >{buttonName}</a>
            </div>
        </div>
        <div class="form-body">
            <center>
            <div class="form-div">
            <h3>LOGIN</h3><br/>
                <form class="form-group" onSubmit={submitHandler}>
                    <input type="text" placeholder='Not Connected' value={Account} class="form-control" required/><br/>
                    <input type="text" placeholder='Name' class="form-control" id="name" required/><br/>
                    <input type="submit" className='form-control' value={"Proceed"}/>
                </form>
            </div>
            </center>
        </div>
    </div>
  )
}
const mapStateToProps = state =>({
    
})
export default connect(mapStateToProps,{setName,setOwner})(Login)
