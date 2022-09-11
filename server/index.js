const PORT = 8000

const express = require('express')
const { v4 : uuidv4 } = require('uuid')
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken')
const uri = "mongodb+srv://vpanda:veddev123@cluster0.pkkew3g.mongodb.net/?retryWrites=true&w=majority"
const app = express()
const cors = require('cors')

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
            user_id = generatedUserId,
            email: sanatizedEmail,
            password: hashedPassword
        }

        const insertedUser = await users.insertOne(data)

        const token = jwt.sign(insertedUser, sanatizedEmail, {expiresIn: 60 * 24})
        res.status(201).json({token, userId: generatedUserId, email: sanatizedEmail})

    } catch (err) {
        console.log(err)
    }
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