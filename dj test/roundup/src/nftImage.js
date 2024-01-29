import axios from 'axios';

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

export async function uploadImage(file) {
  axios.get('http://localhost:3001/api/upload-image', {
      params: {
          file: file
      }
  })
  .then(response => {
      console.log('Image uploaded successfully. CID:', response.data);
  })
  .catch(error => {
      console.error('Error uploading image:', error);
  });
}

export async function uploadMetadata(CID) {
  axios.get('http://localhost:3001/api/upload-metadata', {
      params: {
          CID: CID
      }
  })
  .then(response => {
      console.log('Metadata uploaded successfully. Metadata CID:', response.data.metadataCID);
  })
  .catch(error => {
      console.error('Error uploading metadata:', error);
  });
}
