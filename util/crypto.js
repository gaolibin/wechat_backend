const { createDecipheriv } = require('crypto')

function decrypt(algorithm, encryptedData, key, iv){
    let decipher = createDecipheriv(algorithm, key, iv)
    decipher.setAutoPadding(true)


    let decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')


    return JSON.parse(decoded)
}

module.exports = {
    decrypt
}