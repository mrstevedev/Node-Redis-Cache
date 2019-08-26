const express = require('express');
const fetch = require('node-fetch')
const redis = require('redis')
const { masterKey } = require('./config');


const app = express();

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.REDIS_PORT || 6379

const client = redis.createClient(REDIS_PORT)

async function getCollection(req, res, next) {
    console.log('Fetching data')
    const response = await fetch(`https://api.discogs.com/users/eckosneekz/collection/folders/0/releases?sort=added&sort_order=desc&token=${process.env.NODE_APP_API_KEY}`)

    const data = await response.json()
    
    const collection = data.releases;
    collection.map( data => {
        console.log(data.basic_information)

        res.send('my nodejs app');
    })
}

app.get('/', getCollection)

app.listen(5000, () => {
    console.log(`App is listening on port ${PORT}`)
})