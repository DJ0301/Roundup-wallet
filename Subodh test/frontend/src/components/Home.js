import React from "react";
import walletIcon from '../walletIcon.png'
import { Button } from 'antd';
import { useNavigate } from "react-router-dom";


function Home() {
    const navigate = useNavigate();
  return (
      <div className="content">
        <img src={walletIcon} alt='logo' className='frontLogo' />
        <h2> Hello! </h2>
        <h3 className="h3"> Welcome to the Wallet</h3>
        <Button onClick={() => navigate('/wallet')} className='frontButton' type ='primary'> Create a Wallet</Button>
        <Button onClick={() => navigate('/recover')} className='frontButton' type ='default'> Sign in with phrase</Button>
      </div>
  );
}

export default Home;