import React from "react";
import { Button, Card } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";

function CreateAccount({setWallet, setSeedPhrase}) {
  const [newSeedPhrase, setNewSeedPhrase] = useState(null);
  const navigate = useNavigate();

  function generateWallet(){
    const seedPhrase = ethers.Wallet.createRandom().mnemonic.phrase;
    setNewSeedPhrase(seedPhrase)
  }

  function setWalletMnemonic(){
    setSeedPhrase(newSeedPhrase);
    setWallet(ethers.Wallet.fromPhrase(newSeedPhrase).address)
  }

  return (
      <div className="content">
        <div className="mnemonic">
          <ExclamationCircleOutlined style={{ fontSize: "20px" }} />
          <div>
            Once you generate the seed phrase, save it securely in order to
            recover your wallet in the future.
          </div>
        </div>
        <Button className="frontButton" type="primary" onClick={() => generateWallet()}>
          Generate Seed Phrase
        </Button>
        <Card className="seedPhraseContainer">
         {newSeedPhrase && <pre style={{whiteSpace: "pre-wrap"}}>{newSeedPhrase}</pre>}
        </Card>
        <Button className="frontButton"type="default" onClick={() => setWalletMnemonic()}>
          Open Your New Wallet
        </Button>
        <p className="frontBottom" onClick={()=>navigate("/")}>
          Back Home
        </p>
      </div>
  );
}

export default CreateAccount;