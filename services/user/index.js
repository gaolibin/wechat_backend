const axios = require('axios')
const {Buffer} = require('buffer')

const { Router } = require("express");

const miniAppCfg = require("../../config/mini_program.json")
const { decrypt } = require('../../util/crypto')

const router = new Router()

let sessionKey = ''

router.route('/getSessionKey')
.post(async (req,res,next)=>{
    let infoRes = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?`, {
        params: {
            appid: miniAppCfg.appID,
            secret: miniAppCfg.secretKey,
            js_code: req.body.code,
            grant_type: 'authorization_code'
        }
    })

    console.log(infoRes)
    sessionKey = infoRes.data.session_key

    res.json({
        message: 'success'
    })
})

router.post('/userInfo', async (req, res, next)=>{
    console.log(sessionKey, req.body.iv)
    let key = Buffer.from(sessionKey, 'base64')
    let iv = Buffer.from(req.body.iv, 'base64')
    let encryptedData = Buffer.from(req.body.encryptedData, 'base64')

    let userInfo = decrypt('aes-128-cbc', encryptedData, key, iv)
    // let decipher = createDecipheriv('aes-128-cbc', key, iv)
    // decipher.setAutoPadding(true)

    // // let decrypted = ''

    // var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    // decoded += decipher.final('utf8')

    console.log(userInfo)

    // decipher.on('readable', ()=>{
    //     let chunk

    //     while( null != (chunk = decipher.read())){
    //         decrypted += chunk.toString('utf8')
    //     }
    // })

    // decipher.on('end', ()=>{
    //     console.log('user info',decrypted)
    // })

    // decipher.write(req.body.encryptedData, 'hex')
    // decipher.end()

    res.json({
        data: userInfo
    })
})

module.exports = router