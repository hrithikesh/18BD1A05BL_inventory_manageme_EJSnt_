const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;

var db 
MongoClient.connect('mongodb://localhost:27017/inventory',  {useUnifiedTopology: true}, (err, client) =>{
	if(err) return console.log(err)
	db = client.db('inventory')
	app.listen(5000, () => console.log('listening on port 5000...'))
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', async (req, res) => {
	try{
		const result = await db.collection('Fashion').find().toArray()
		res.render('homepage.ejs', {data: result})
	}catch(err){}
})

app.get('/add', (req, res) => {
	res.render('add.ejs') 
})

app.get('/update', (req, res) => {
	res.render('update.ejs')
})

app.get('/delete', (req, res) => {
	res.render('delete.ejs')
})



app.post('/add', async (req, res) => {
	try{
		const result = await db.collection('Fashion').insertOne(req.body)
	}catch(err){
        console.log(err)
    }
	res.redirect('/')
})

app.post('/update', async (req, res) => {
	try{
		const product = await db.collection('Fashion').findOne({id: req.body.id})
		const new_value = parseInt(product.stock) + parseInt(req.body.stock)
		const result = await db.collection('Fashion').updateOne(
			{id: req.body.id}, 
			{$set: {stock: new_value}},
			{sort: {id: -1}}, (err, result) => {
		})
	}catch(err){
        console.log(err)
    }	
	res.redirect('/')	
})

app.post('/delete', async (req, res) => {
	try{
		const id = req.body.id
		const result = await db.collection('Fashion').deleteOne({id: id})
	}catch(err){
        console.log(err)
    }
	res.redirect('/')
})
