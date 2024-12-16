//David Holcer 
const crypto = require("crypto");
const fs = require("fs");

const generateKeys = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    // Save keys locally
    fs.writeFileSync("public.pem", publicKey); // Save public key
    fs.writeFileSync("private.pem", privateKey); // Save private key

    console.log("Keys generated and saved to public.pem and private.pem");
};

generateKeys();