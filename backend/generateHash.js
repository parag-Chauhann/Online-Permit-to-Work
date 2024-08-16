const crypto = require('crypto');

// Function to generate hash
function generateHash({ txnid, amount, firstname, email, key, salt }) {
  const hashString = `${key}|${txnid}|${amount}|Subscription Plan|${firstname}|${email}|||||||||||${salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
}

// Parameters for hash generation
const txnid = '1723447833691';
const amount = '2000';
const firstname = 'parag';
const email = 'parag1111@gmail.com';
const key = 'Ulqqo5';
const salt = 'aZrBIpcZzGCbF9vHxVntzLOF7oSyauoc';

// Generate and print the hash
const hash = generateHash({ txnid, amount, firstname, email, key, salt });
console.log('Generated Hash:', hash);
