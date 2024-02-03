import axios from 'axios';
const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
}).replace(/\//g, '-'); 
export async function generateNFTImage(text) {
    axios.get('http://localhost:3001/api/generate-nft', {
        params: {
            text: text 
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