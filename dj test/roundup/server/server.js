const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors module
const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
}).replace(/\//g, '-'); 
const axios = require('axios');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const pinataApiKey = '1f7f2180d0fdd2aa1663';
const pinataSecretApiKey = '3ed46755250308ffb5bfe870f8403ff1859377aed3a8198d32dd0de995c56ff0';

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


async function uploadImage(imagePath) {
  try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(imagePath));
      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
          headers: {
              'Content-Type':`multipart/form-data, boundary=${formData._boundary}`,
              'pinata_api_key': pinataApiKey,
              'pinata_secret_api_key': pinataSecretApiKey
          }
      });
      console.log('Image uploaded to IPFS. IPFS Hash:', response.data.IpfsHash);
      return response.data.IpfsHash; 
  } catch (error) {
      console.error('Error uploading image to IPFS:', error);
      throw error;
  }
}

async function uploadMetadata(CID) {
  try {
    // Create the metadata object
    const metadata = {
      name: 'My NFT for savings for the week of '+currentDate ,
      description: 'This is an NFT representing my savings for the week of '+currentDate,
      image: `https://ipfs.io/ipfs/${CID}`,
    };

    const formData = new FormData();
    formData.append('file', JSON.stringify(metadata), { filename: 'metadata.json' }); // Convert metadata to JSON string and append to FormData

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set Content-Type header for FormData
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey
      }
    });

    console.log('Metadata uploaded to IPFS. IPFS Hash:', response.data.IpfsHash);
    return response.data.IpfsHash; // Return the IPFS hash
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
}


app.get('/api/generate-nft', (req, res) => {
    const text = req.query;
    if (!text) {
        return res.status(400).send('Text parameter is required.');
    }

    // Call the function and generate the image
    generateNFTImage(text);

    // Return success response
    return res.status(200).send('NFT image generated successfully.');
});
// app.post('/api/upload-image', async (req, res) => {
//     try {
//         const { imagePath } = req.body;
//         const imageCid = await uploadImage(imagePath);
//         res.json({ imageCid });
//     } catch (error) {
//         console.error('Error uploading image:', error);
//         res.status(500).json({ error: 'Internal server error.' });
//     }
// });


// Start the server

app.post('/api/upload-image', (req, res) => {
  console.log(req.body.imagePath);
  if (!req.body.imagePath) {
      return res.status(400).json({ error: 'Image path is required.' });
  }
  uploadImage(req.body.imagePath)
      .then(imageCid => {
          res.json({ imageCid });
      })
      .catch(error => {
          console.error('Error uploading image:', error);
          res.status(500).json({ error: 'Internal server error.' });
      });
});

// Function to upload metadata to IPFS
app.post('/api/upload-metadata', (req, res) => {
  if (!req.body.CID) {
      return res.status(400).json({ error: 'CID is required.' });
  }
  uploadMetadata(req.body.CID)
      .then(metadataCid => {
          res.json({ metadataCid });
      })
      .catch(error => {
          console.error('Error uploading metadata:', error);
          res.status(500).json({ error: 'Internal server error.' });
      });
});

const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
