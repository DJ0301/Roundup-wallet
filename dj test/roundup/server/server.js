const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors'); // Import cors module
const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
}).replace(/\//g, '-'); 

app.use(cors());

function generateNFTImage(text) {
    // Get current date in dd/mm/yy format
    const filename = `${currentDate}.svg`;

    const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="50">
            <rect width="100%" height="100%" fill="url(#bgImage)"/>
            <text x="25" y="25" font-family="Arial" font-size="12">${text}</text>
        </svg>
    `;

    fs.writeFileSync(filename, Buffer.from(svgContent));
    console.log(`NFT image generated successfully: ${filename}`);
}

const FormData = require("form-data")
const fetch = require("node-fetch")

const uploadImage = async (file) => {
    try {
      const data = new FormData();
      data.append(`${currentDate}.svg`, fs.createReadStream(file));
  
      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2NTJjMDQ1OC1iZGZkLTQwNmMtYmE1NC01MmU0MGQ1YWNmNTgiLCJlbWFpbCI6ImRoYW5hbmpheWJ1aWRsQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxNTM3MjllOTRhMGY0NDk0Yjc4YSIsInNjb3BlZEtleVNlY3JldCI6IjRhMDQzMjYwYTU0MTllZjQ1ZDI1ZDBhZjNlMjE1MzZiZGEwY2VmYjFiYWQwMzRiMWM5M2Y1MmM1MWY4ZWUxMDEiLCJpYXQiOjE3MDYzOTEwNDJ9.AEgUFIywMLuAL5Js0geEutJBP-8azM4FstTAAsxnWhQ`
        },
        body: data
      });
  
      const resData = await res.json(); // Parse response as JSON
  
      console.log("File uploaded, CID:", resData.IpfsHash);
      return resData.IpfsHash; // Return the CID
    } catch (error) {
      console.log(error);
    }
  };
  

const uploadMetadata = async (CID) => {
  try {
    const data = JSON.stringify({
      pinataContent: {
        name: `Your savings for the week: ${currentDate}`,
        description: `This is an NFT displaying your savings for the week: ${currentDate}`,
        image: `ipfs://${CID}`,
      },
    });

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2NTJjMDQ1OC1iZGZkLTQwNmMtYmE1NC01MmU0MGQ1YWNmNTgiLCJlbWFpbCI6ImRoYW5hbmpheWJ1aWRsQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxNTM3MjllOTRhMGY0NDk0Yjc4YSIsInNjb3BlZEtleVNlY3JldCI6IjRhMDQzMjYwYTU0MTllZjQ1ZDI1ZDBhZjNlMjE1MzZiZGEwY2VmYjFiYWQwMzRiMWM5M2Y1MmM1MWY4ZWUxMDEiLCJpYXQiOjE3MDYzOTEwNDJ9.AEgUFIywMLuAL5Js0geEutJBP-8azM4FstTAAsxnWhQ`
      },
      body: data
    })
    const resData = await res.json()
    console.log("Metadata uploaded, CID:", resData.IpfsHash)
    return resData.IpfsHash
  } catch (error) {
    console.log(error)
  }
}


app.get('/api/generate-nft', (req, res) => {
    const { text } = req.query;
    if (!text) {
        return res.status(400).send('Text parameter is required.');
    }

    // Call the function and generate the image
    generateNFTImage(text);

    // Return success response
    return res.status(200).send('NFT image generated successfully.');
});

app.get('/api/upload-image', async (req, res) => {
    try {
        const { file } = req.query;
        if (!file) {
            return res.status(400).send('File parameter is required.');
        }

        // Call the function to upload the image
        const CID = await uploadImage(file);

        // Return success response with CID
        return res.status(200).json({ CID });
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).send('Internal server error.');
    }
});

app.get('/api/upload-metadata', async (req, res) => {
    try {
        const { CID } = req.query; // Assuming the CID is provided as a query parameter
        if (!CID) {
            return res.status(400).send('CID parameter is required.');
        }

        // Call the function to upload metadata
        const metadataCID = await uploadMetadata(CID);

        // Return success response with metadata CID
        return res.status(200).json({ metadataCID });
    } catch (error) {
        console.error('Error uploading metadata:', error);
        return res.status(500).send('Internal server error.');
    }
});

// Start the server
const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});