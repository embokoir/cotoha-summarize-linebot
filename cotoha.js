const dotenv = require('dotenv').config()
const axios = require('axios')

const ACCESS_TOKEN_PUBLISH_URL = process.env.ACCESS_TOKEN_PUBLISH_URL
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

const BASE_URL = 'https://api.ce-cotoha.com/api/dev/'

async function summarize(sentence) {
    const urlEndPoint = 'nlp/beta/summary'
    return axios({
        url: BASE_URL + urlEndPoint,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${await getAccessToken()}`
        },
        data: {
            'document': sentence,
            'sent_len': 1
        }
    }).then(res => {
        const summary = res.data.result
        console.log(summary)
        if (!summary) return false
        return summary
    }).catch(err => {
        console.log(err.response.status)
        console.log(err.response.data)
        return false
    })
}

module.exports.summarize = summarize

async function getAccessToken() {
    return axios({
        url: ACCESS_TOKEN_PUBLISH_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            'grantType': "client_credentials",
            'clientId': CLIENT_ID,
            'clientSecret': CLIENT_SECRET
        }
    }).then(res => {
        // console.log('access token successfully got')
        // console.log(res.status)
        // console.log(res.data)
        // console.log(res.data.access_token)
        return res.data.access_token
    }).catch(err => {
        console.log('access token error')
        console.log(err.response.status)
        console.log(err.response.data)
        return ''
    })
}
