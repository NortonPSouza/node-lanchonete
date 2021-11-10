const crypto = require('crypto');

const password = 'admin';
const iv = Buffer.alloc(16, 0);
const algorithm = 'aes-192-cbc';
const key = crypto.scryptSync(password, 'salt', 24);

class Crypt {

    static encrypt(valueEncrypt) {
        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encrypted = cipher.update(`${valueEncrypt}`, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return encrypted;
    }

    static descrypt(valueEncrypt) {
        const decipher = crypto.createDecipheriv(algorithm, key, iv);

        let decrypted = decipher.update(valueEncrypt, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    }
}

module.exports = Crypt;