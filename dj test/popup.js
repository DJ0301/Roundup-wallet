const fs = require('fs');

function generateImageWithText(text, filename) {
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="50">
      <rect width="100%" height="100%" fill="white"/>
      <text x="10" y="30" font-family="Arial" font-size="20">${text}</text>
    </svg>
  `;

  fs.writeFileSync(filename, Buffer.from(svgContent));
}

// Example usage:
generateImageWithText("Hello, World!", "custom_image.svg");
