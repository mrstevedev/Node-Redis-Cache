const express = require('express');
const fetch = require('node-fetch')
const redis = require('redis')
const { masterKey } = require('./config');


const app = express();

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.REDIS_PORT || 6379

const client = redis.createClient(REDIS_PORT)

async function getCollection(req, res, next) {
    try {
        console.log('Fetching data')
        const response = await fetch(`https://api.discogs.com/users/eckosneekz/collection/folders/0/releases?sort=added&sort_order=desc&token=${process.env.NODE_APP_API_KEY}`)
    
        const data = await response.json()
        
        const collection = data.releases
        const collectionStr = JSON.stringify(data.releases);
        
        client.setex('collection', 3600, collectionStr)

        res.send('node app');

        collection.map( data => {
            console.log(data.basic_information)
        })
    }
   catch(err) {
       console.log(err)
       res.status(500)
   }
}

// Cache middleware 
function cache(req, res, next) {

    client.get('collection', (err, data) => {
        if(err) throw err;
        if(data !== null)  {
            res.send(data) 
        } else {
            next()
        }
    })
}

app.get('/', cache, getCollection)

app.listen(5000, () => {
    console.log(`App is listening on port ${PORT}`)
})