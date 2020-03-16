const dotenv = require('dotenv').config()
const axios = require('axios')
const express = require('express')
const LINE    = require('@line/bot-sdk');
const cotoha = require('./cotoha')
const util = require('./util')

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN
const CHANNEL_SECRET       = process.env.CHANNEL_SECRET

const PORT = 3000
const app = express()
const config = {
    channelAccessToken: CHANNEL_ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET
}
const line = new LINE.Client(config)

app.post('/webhook', LINE.middleware(config), async (req, res) => {
    console.log(req.body.events)
    if (req.body.events[0].source.userId === 'Udeadbeefdeadbeefdeadbeefdeadbeef') {
        res.send(200)
        return
    }
    const results = await Promise
          .all(req.body.events.map(handleEvent))
          .then(results => {
              return results
          })
    await Promise
        .all(results.map(util.log))
        .then(result => res.json(result))
        .catch(err => err)
})

app.listen(PORT)
console.log(`Server running at ${PORT}`)

async function handleEvent(event) {
    console.log(event)

    let replyText = ''
    switch (event.type) {
    case 'message':
        if (event.message.type === 'text') {
            const messageText = event.message.text
            const textValidation = await util.validateText(messageText)
            if (!textValidation.isValid) {
                replyText = textValidation.reason
            } else {
                replyText = `要約すると、\n\n${await cotoha.summarize(messageText)}`
            }
        } else {
            replyText = 'テキストを送ってね'
        }
        break;
    case 'follow':
        replyText = 'フォローありがとう。君の文章を要約するよ。'
            + '\n\nCOTOHA APIを利用しています。詳しくはこちら https://api.ce-cotoha.com/'
        break;
    default:
        replyText = 'テキストを送ってね!!'
        break;
    }

    line.replyMessage(event.replyToken, {
        type: 'text',
        text: replyText
    })
    return {...event, replyText: replyText}
}
