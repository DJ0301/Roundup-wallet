import axios from 'axios';
const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
}).replace(/\//g, '-'); 
const pinataApiKey = '1f7f2180d0fdd2aa1663';
const pinataSecretApiKey = '3ed46755250308ffb5bfe870f8403ff1859377aed3a8198d32dd0de995c56ff0';
export async function generateNFTImage(text) {
    axios.get('http://localhost:3001/api/generate-nft', {
        params: {
            text: text // Corrected parameter passing
        }
    })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error('Error generating NFT image:', error);
    });
}

export async function uploadImage(imagePath) {
    try {
        const response = await axios.post('http://localhost:3001/api/upload-image', { imagePath });
        console.log(response);
        return response.data.imageCid;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
  }

export async function uploadMetadata(CID) {
    try {
        const response = await axios.post('http://localhost:3001/api/upload-metadata', { CID });
        console.log(response);
        return response.data.metadataCid;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
}