import CryptoJS from 'crypto-js';
import { EDK } from '../config/eDK';

// 
// This is for the back-end
// 

export const encryptData = (message) => {
    // Encrypt
    let ciphertext = CryptoJS
        .AES
        .encrypt(JSON.stringify(message) , EDK)


    return ciphertext.toString()
}

export const decryptData = (ciphertext) => {
    // Decrypt
    let bytes = CryptoJS
        .AES
        .decrypt(ciphertext, EDK)

    let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

    return decryptedData
}