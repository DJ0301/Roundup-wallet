const fs = require('fs');

function generateNFTImage(text) {
    // Get current date in dd/mm/yy format
    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    }).replace(/\//g, '-'); 

    // Filename with current date
    const filename = `${currentDate}.svg`;

    const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="50">
            <defs>
                <pattern id="bgImage" patternUnits="userSpaceOnUse" width="200" height="50">
                    <image xlink:href="data:image/png;base64,${encodeImage()}" x="0" y="0" width="200" height="50" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bgImage)"/>
            <text x="25" y="25" font-family="Arial" font-size="12">${text}</text>
        </svg>
    `;

    fs.writeFileSync(filename, Buffer.from(svgContent));
    console.log(`NFT image generated successfully: ${filename}`);
}

function encodeImage() {
    const imageContent = fs.readFileSync('/Users/dhananjayjoshi/Documents/GitHub/Roundup-wallet/dj test/roundup/src/bg.png', 'base64');
    return imageContent;
}
generateNFTImage("Your savings this week: $100!");
