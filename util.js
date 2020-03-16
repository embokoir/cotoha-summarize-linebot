require('dotenv').config()
const axios = require('axios')
const url = process.env.LOG_URL

async function log(event) {
    return axios.post(url, event)
        .then(res => {
            console.log('Log saved')
            return {}
        })
        .catch(err => {
            console.log(err.response)
            return {}
        })
}

async function validateText(text) {
    let res = {
        isValid: false,
        reason: ''
    }
    if (text.length < 5) {
        res.reason = '5文字以上で送ってね'
        return res
    }
    if (text.length > 5000) {
        res.reason = '5000文字以下で送ってね'
        return res
    }

    res.isValid = true
    return res
}


module.exports.log = log
module.exports.validateText = validateText
