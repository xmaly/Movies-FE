const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const SWAGGER_URL = process.env.SWAGGER_URL || 'http://localhost:5013/openapi/v1.json';
const OUTPUT_FILE = path.join(__dirname, '../swagger.json');

async function fetchSwagger() {
  return new Promise((resolve, reject) => {
    const protocol = SWAGGER_URL.startsWith('https') ? https : http;
    
    console.log(`Fetching Swagger spec from: ${SWAGGER_URL}`);
    
    protocol.get(SWAGGER_URL, (response) => {
      let data = '';
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch Swagger spec. Status: ${response.statusCode}`));
        return;
      }
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          // Validate JSON
          const jsonData = JSON.parse(data);
          
          // Write to file
          fs.writeFileSync(OUTPUT_FILE, JSON.stringify(jsonData, null, 2));
          console.log(`✓ Swagger spec fetched successfully and saved to ${OUTPUT_FILE}`);
          resolve();
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Failed to fetch Swagger spec: ${error.message}`));
    });
  });
}

fetchSwagger()
  .catch((error) => {
    console.error(`✗ Error: ${error.message}`);
    process.exit(1);
  });
