const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')

const app = express()
const options = {
	origin: '*'
}
app.use(cors(options))
app.use(express.json())

const db = mysql.createConnection({
	host: '127.0.0.1',
	port: 3306,
	user: 'root',
	password: 'password',
	database: 'goodreads2'
});

db.connect((err) => {
	if (err) { throw err }
	console.log('database connection established')
});

function queryMySql(query) {
	return new Promise((resolve, reject) => {
		db.query(query, (err, result) => {
			if (err) {
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}

app.get('/', (req, res) => {
	res.send('hello backend')
})
// authenticate
app.get('/user', (req, res) => {
	console.log(req.query)
	const { login, password } = req.query
	const authSql = (
		"SELECT * " +
		"FROM user " +
		"WHERE User_Login = '" + login + "' " +
		"AND User_Password = '" + password + "';"
	)
	db.query(authSql, (err, result) => {
		if (err) {
			console.log(err)
			res.sendStatus(500)
			return
		}
		if (result.length === 0) {
			res.status(400).send({ message: "user not found" })
			return
		}
		res.send(result[0])
		console.log(result[0])
		return
	})
})
// create account
app.post('/user', (req, res) => {
	console.log(req.body)
	const { login, password, name } = req.body
	if (login === '' || password === '' || name === '') {
		console.error('user trying to create empty string login/password/username')
		res.status(400).send({ message: 'account fields shouldn\'t be empty.' })
	}
	const findUserSql = "SELECT * " +
		"FROM user " +
		"WHERE User_Login = '" + login + "' " +
		"AND User_Password = '" + password + "';";
	const createUserSql = (
		"INSERT INTO user (User_Login,User_Password, User_Name) " +
		"VALUES ('" + login + "', '" + password + "', '" + name + "');"
	)
	const findUserIDSql = (
		"SELECT User_ID " +
		"FROM user " +
		"WHERE User_Login = '" + login + "';"
	)
	db.query(findUserSql, (err, result) => {
		if (err) throw err
		console.log(`finding user, result =${result},${result.length}}`)
		if (result.length !== 0) {
			res.status(400).send({ message: 'existing user' })
			console.log(result[0])
			return
		}
		db.query(createUserSql, (err, result) => {
			if (err) {
				console.error(err)
				res.sendStatus(500)
				return
			}
			db.query(findUserIDSql, (err, result) => {
				if (err) {
					console.error(err)
					res.sendStatus(500)
					return
				}
				res.send(result[0])
				console.log('userid=', result)
				return
			})
		})
	})
	// res.send({ o: 'hello user' })
})

// get all wishlist
app.get('/wishlist', async (req, res) => {
	console.log(req.query)
	const {User_ID} = req.query
	const getWishlistSql = (
		"SELECT b.* " +
		"FROM book b, adds_to_wishlist w " +
		"WHERE w.User_ID = " + User_ID + " " +
		"AND w.Book_ID = b.Book_ID;"
	)
	try{
		const data = await queryMySql(getWishlistSql)
		res.send(data)
	}catch(e){
		res.status(500).send(e)
	}
	
})

// get book details - everything related to a book by bookid
app.get('/book', (req, res) => {
	console.log(req.query)
	const Book_ID = req.query.id
	const getBookSql = (
		"SELECT b.* " +
		"FROM book b " +
		"WHERE b.Book_ID = " + Book_ID + ";"
	)
	const getAuthorSql = (
		"SELECT a.* " +
		"FROM author a, is_written_by w " +
		"WHERE w.Book_ID = " + Book_ID + " " +
		"AND w.Author_ID = a.Author_ID;"
	)
	const getSeriesSql = (
		"SELECT s.* " +
		"FROM series s, is_part_of p " +
		"WHERE p.Book_ID = " + Book_ID + " " +
		"AND p.Series_ID = s.Series_ID;"
	)
	const getGenreSql = (
		"SELECT g.Genre_Name, g.Is_Tagged_As_Number_Of_Times " +
		"FROM is_tagged_as g " +
		"WHERE g.Book_ID = " + Book_ID + " " +
		"ORDER BY g.Is_Tagged_As_Number_Of_Times DESC;"
	)
	Promise.all([getBookSql, getAuthorSql, getSeriesSql, getGenreSql].map(x => queryMySql(x))).then((data) => {
		let answer = {}
		answer = { ...data[0][0], authors: data[1], series: data[2], genres: data[3] }
		res.send(answer)
	}, (error) => {
		res.status(500).send(error)
	})
})

app.listen('3001', () => {
	console.log('server running on port 3001')
})