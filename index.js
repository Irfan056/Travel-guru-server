const express = require('express');
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());




// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pdz4y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fo3sy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db("travel-guru");
        const roomCollection = database.collection("places");
        const orderCollection = database.collection("order-daw");

        // GET API (get all rooms)
        app.get('/rooms', async (req, res) => {
            const query = {};
            const cursor = roomCollection.find(query);
            const rooms = await cursor.toArray();
            res.send(rooms);
        })
        // GET API (get all orders)
        app.get('/orders', async (req, res) => {
            const query = {};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })
        // GET API (get room by id)
        app.get('/room/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const room = await roomCollection.findOne(query);
            res.send(room);
        })
        // GET API (get orders by email)
        app.get('/myOrders/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = await orderCollection.find(query);
            const myOrders = await cursor.toArray();
            res.send(myOrders);
        })

        // POST API
        app.post('/placeOrder', async (req, res) => {
            const orderDetails = req.body;
            const result = await orderCollection.insertOne(orderDetails);
            res.json(result);
        })
        // POST API
        app.post('/addNewRoom', async (req, res) => {
            const newRoom = req.body;
            const result = await roomCollection.insertOne(newRoom);
            res.json(result);
        })

        // DELETE API 
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

        // UPDATE API
        app.put('/approve/:id', async (req, res) => {
            const id = req.params.id;
            const approvedOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: approvedOrder.status
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('travel-guru is starting.....');
})
app.listen(port, (req, res) => {
    console.log('listening to port:', port);
})