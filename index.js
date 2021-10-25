const express = require('express')
const app = express()
const port = 5000;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()


app.use(cors())
app.use(express.json())


// mongodb setup 
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://second-database_2:4bGZYfzyAqBMhLfB@cluster0.aghhg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('genius-car-mechanics')
        const servicesCollection = database.collection('services')
        //   get all services
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })
        // get specific service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query)
            res.json(result)
            console.log(id)
        })
        // post data
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('post is hitting.')
            const result = await servicesCollection.insertOne(service)
            res.send(result)
        })
        // delete specific service
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            console.log("delete hitting")
            const result = await servicesCollection.deleteOne(query)
            res.send(result)
        })
        console.log('connected to database.')
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('I am just testing port.')
})
app.listen(port, () => {
    console.log('server running at the port', port)
})