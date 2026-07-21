import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
    console.error('Usage: npm run admin:hash-password -- "chosen-password"');
    process.exit(1);
}

const saltRounds = 12;
const hash = bcrypt.hashSync(password, saltRounds);

console.log('\n--- Admin Password Hash Generator ---');
console.log('Copy the hash below and set it as ADMIN_PASSWORD_HASH in your .env file.\n');
console.log(hash);
console.log('\nDo NOT save your plaintext password anywhere in the source code.');
