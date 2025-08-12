const fs = require('fs');

try {
  // Read the Firebase service key file
  const key = fs.readFileSync('./firebase-admin-key.json', 'utf8');
  
  // Convert to base64
  const base64 = Buffer.from(key).toString('base64');
  
  console.log('Base64 encoded Firebase service key:');
  console.log(base64);
  
  // Optionally save to a file
  fs.writeFileSync('./firebase-key-base64.txt', base64);
  console.log('\nBase64 string saved to firebase-key-base64.txt');
  
} catch (error) {
  console.error('Error reading or converting file:', error.message);
  
  // Check if the file exists
  if (error.code === 'ENOENT') {
    console.log('Make sure the file "firebase-admin-key.json" exists in the current directory');
  }
}