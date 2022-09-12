const PORT = 8000

const express = require('express')
const { v4 : uuidv4 } = require('uuid')
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken')
const uri = "mongodb+srv://vpanda:veddev123@cluster0.pkkew3g.mongodb.net/?retryWrites=true&w=majority"
const cors = require('cors')
const bcrypt = require('bcrypt')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json('Hello World!')
})

app.post('/signup', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    const {email, password} = req.body

    const generatedUserId = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = await database.collection('users')

        const exisitingUser = await users.findOne({ email})

        if (exisitingUser) {
            return res.status(409).send('User already exists! Please login instead')
        }

        const sanatizedEmail = email.toLowerCase()

        const data = {
            user_id: generatedUserId,
            email: sanatizedEmail,
            password: hashedPassword
        }

        const insertedUser = await users.insertOne(data)

        const token = jwt.sign(insertedUser, sanatizedEmail, {expiresIn: 60 * 24})
        res.status(201).json({token, userId: generatedUserId, email: sanatizedEmail})

    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
})

app.post('/login', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: { version: ServerApiVersion.v1 } });
    const {email, password} = req.body

    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users');
        const user = await users.findOne({ email})

        const correctPassword = await bcrypt.compare(password, user.hashedPassword)

        if(user && correctPassword) {
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 24
            }) 
            res.status(201).json({token, userId: user.user_id, email})
        }
        res.status(400).send('Invalid credentials')
    } catch (err) {
        console.log(err)
    }
})


app.get('/user', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    const userId = req.query.userId
    
    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users');

        const query = { user_id: userId }
        const user = await users.findOne(query)
        res.send(user)
    } finally {
        await client.close()
    }
})

app.get('/addmatch', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    const {userId, matchedUserId} = req.query

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = await database.collection('users')

        const query = { user_id: userId }
        const updateDocument = {
            $push: {
                matches: {user_id: matchedUserId}
            }
        }
        const user = await users.updateOne(query, updateDocument)
        res.send(user)
    } finally {
        await client.close()
    }
})


app.get('/users', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    const userIds = JSON.parse(req.query.userIds)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = await database.collection('users')

        const pipeline = [
            {
                '$match': {
                    'used_id': {
                        '$in': userIds
                    }
                }
            }
        ]
        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers)
    } finally {
        await client.close()
    }
})

app.get('/gendered-users', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    const gender = req.query.gender

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = await database.collection('users')
        const query = {gender_identity: {$eq: gender}}
    }
})

app.listen(PORT, () => console.log(('Server running on PORT: ') + PORT))