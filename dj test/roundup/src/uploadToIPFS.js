const FormData = require("form-data")
const fetch = require("node-fetch")
const fs = require("fs")

export const uploadImage = async (file) => {
  try {
    const data = new FormData()
    data.append("file", fs.createReadStream(file))
    data.append("pinataMetadata", '{"name": "pinnie"}')

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2NTJjMDQ1OC1iZGZkLTQwNmMtYmE1NC01MmU0MGQ1YWNmNTgiLCJlbWFpbCI6ImRoYW5hbmpheWJ1aWRsQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxNTM3MjllOTRhMGY0NDk0Yjc4YSIsInNjb3BlZEtleVNlY3JldCI6IjRhMDQzMjYwYTU0MTllZjQ1ZDI1ZDBhZjNlMjE1MzZiZGEwY2VmYjFiYWQwMzRiMWM5M2Y1MmM1MWY4ZWUxMDEiLCJpYXQiOjE3MDYzOTEwNDJ9.AEgUFIywMLuAL5Js0geEutJBP-8azM4FstTAAsxnWhQ`
      },
      body: data
    })
    resData = await res.json()
    console.log("File uploaded, CID:", resData.IpfsHash)
    return resData.IpfsHash
  } catch (error) {
    console.log(error)
  }
}

export const uploadMetadata = async (name, description, CID,date,time) => {
  try {
    const data = JSON.stringify({
      pinataContent: {
        name: `${name}`,
        description: `${description}`,
        image: `ipfs://${CID}`,
        date : `${date}`,
        time : `${time}`
      }
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

const uploadImageAndMetadata = async () => {
    try {
      // Call uploadImage function to upload an image and get CID
      const imageCID = await uploadImage('path/to/image.jpg');
  
      // Get current date and time
      const { date, time } = getCurrentDateTime();
  
      // Call uploadMetadata function to upload metadata along with CID, date, and time
      await uploadMetadata('Your updated savings ! ', 'This is your new balance for a new week . Great Job!', imageCID, date, time);
    } catch (error) {
      console.error('Error:', error);
    }
  };