const cryptor = require('crypto');

const password = 'admin';
const iv = Buffer.alloc(16, 0);
const algorithm = 'aes-192-cbc';
const key = cryptor.scryptSync(password, 'salt', 24);

class Crypt {

    static encrypt(valueEncrypt: string | number) {
        const cipher = cryptor.createCipheriv(algorithm, key, iv);

        let encrypted = cipher.update(`${valueEncrypt}`, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return encrypted;
    }

    static descrypt(valueEncrypt: string | number) {
        const decipher = cryptor.createDecipheriv(algorithm, key, iv);

        let decrypted = decipher.update(valueEncrypt, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}

module.exports = Crypt;