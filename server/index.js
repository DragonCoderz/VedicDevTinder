const PORT = 8000

const express = require('express')

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://vpanda:veddev123@cluster0.pkkew3g.mongodb.net/?retryWrites=true&w=majority"
const app = express()

app.get('/', (req, res) => {
    res.json('Hello World!')
})

app.post('/signup', (req, res) => {
    res.json('Hello World!')
})

app.get('/users', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = await database.collection('users')

        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers)
    } finally {
        await client.close()
    }
})

app.listen(PORT, () => console.log(('Server running on PORT: ') + PORT))