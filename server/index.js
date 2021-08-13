const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const { query } = require('express')

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
})
app.post('/wishlist', (req, res) => {
	console.log(req.body)
	let { User_ID, Book_ID } = req.body
	if (isNaN(Number(User_ID)) || isNaN(Number(Book_ID))) {
		res.sendStatus(400) // wrong input
		return
	}

	const addWishlistSql = ("INSERT INTO adds_to_wishlist (User_ID, Book_ID) " +
		"VALUES ('" + User_ID + "', '" + Book_ID + "');")
	queryMySql(addWishlistSql)
		.then(res.sendStatus(200)) // success
		.catch(err => {
			console.error(err)
			res.sendStatus(400) // wrong input
		})
})
app.delete('/wishlist', async (req, res) => {
	const { User_ID, Book_ID } = req.query
	const deleteWishlistSql = ("DELETE FROM adds_to_wishlist " +
		"WHERE User_ID = " + User_ID + " " +
		"AND Book_ID = " + Book_ID + ";")
	try {
		await queryMySql(deleteWishlistSql)
		res.sendStatus(200) // ok
		return
	} catch (err) {
		console.error(err)
		res.sendStatus(400)
	}
})
app.get('/search', async (req, res) => {
	let formattedQuery = req.query
	for (let key in formattedQuery) {
		if (formattedQuery[key] === 'undefined' || formattedQuery[key] === 'null') {
			formattedQuery[key] = ''
		}
	}
	if (!formattedQuery.datefrom) {
		formattedQuery.datefrom = '0'
	}
	if (!formattedQuery.dateto) {
		formattedQuery.dateto = '9999'
	}
	if (!formattedQuery.pagefrom) {
		formattedQuery.pagefrom = '0'
	}
	if (!formattedQuery.pageto) {
		formattedQuery.pageto = '99999999'
	}
	console.log('advanced search:', formattedQuery)
	let searchSql
	if (req.query.type === 'author') {

		if (!formattedQuery.genre || formattedQuery.genre == "") {
			if (formattedQuery.series = "") {
				searchSql = (`SELECT a.* 
	
				FROM book b, is_written_by ba, author a, work w  

				WHERE b.Book_Title LIKE '%${formattedQuery.title}%' 

				AND a.Author_Name LIKE '%${formattedQuery.author}%' 

				AND b.Book_Format LIKE '%${formattedQuery.format}%' 

				AND b.Book_Number_Of_Pages BETWEEN ${formattedQuery.pagefrom} AND ${formattedQuery.pageto} 

				AND w.Work_Original_Publish_Date BETWEEN ${formattedQuery.datefrom} AND ${formattedQuery.dateto} 

				AND b.Work_ID = w.Work_ID  

				AND b.Book_ID = ba.Book_ID 

				AND ba.Author_ID = a.Author_ID   

			 GROUP BY a.Author_ID;`)
			} else {
				searchSql = `SELECT a.* 
	
				FROM book b, is_written_by ba, author a, is_part_of bs, series s, work w  

				WHERE b.Book_Title LIKE '%${formattedQuery.title}%' 

				AND a.Author_Name LIKE '%${formattedQuery.author}%' 

				AND s.Series_Name LIKE '%${formattedQuery.series}%' 

				AND b.Book_Format LIKE '%${formattedQuery.format}%' 

				AND b.Book_Number_Of_Pages BETWEEN ${formattedQuery.pagefrom} AND ${formattedQuery.pageto} 

				AND w.Work_Original_Publish_Date BETWEEN ${formattedQuery.datefrom} AND ${formattedQuery.dateto} 

				AND s.Series_ID = bs.Series_ID  

				AND bs.Book_ID = b.Book_ID  

				AND b.Work_ID = w.Work_ID  

				AND b.Book_ID = ba.Book_ID 

				AND ba.Author_ID = a.Author_ID   

				GROUP BY a.Author_ID;`
			}
		} else {
			if (!formattedQuery.series) {
				searchSql = `SELECT a.* 
	
				FROM book b, is_written_by ba, author a, is_tagged_as g, work w  

				WHERE b.Book_Title LIKE '%${formattedQuery.title}%' 

				AND a.Author_Name LIKE '%${formattedQuery.author}%' 

				AND g.Genre_Name = '${formattedQuery.genre}' 

				AND b.Book_Format LIKE '%${formattedQuery.format}%' 

				AND b.Book_Number_Of_Pages BETWEEN ${formattedQuery.pagefrom} AND ${formattedQuery.pageto} 

				AND w.Work_Original_Publish_Date BETWEEN ${formattedQuery.datefrom} AND ${formattedQuery.dateto} 

				AND b.Book_ID = g.Book_ID  

				AND b.Work_ID = w.Work_ID  

				AND b.Book_ID = ba.Book_ID 

				AND ba.Author_ID = a.Author_ID   

				GROUP BY a.Author_ID;`
			} else {
				searchSql = `SELECT a.* 
	
				FROM book b, is_written_by ba, author a, is_part_of bs, series s, is_tagged_as g, work w  

				WHERE b.Book_Title LIKE '%${formattedQuery.title}%' 

				AND a.Author_Name LIKE '%${formattedQuery.author}%' 

				AND s.Series_Name LIKE '%${formattedQuery.series}%' 

				AND g.Genre_Name = '${formattedQuery.genre}' 

				AND b.Book_Format LIKE '%${formattedQuery.format}%' 

				AND b.Book_Number_Of_Pages BETWEEN ${formattedQuery.pagefrom} AND ${formattedQuery.pageto} 

				AND w.Work_Original_Publish_Date BETWEEN ${formattedQuery.datefrom} AND ${formattedQuery.dateto} 

				AND s.Series_ID = bs.Series_ID  

				AND bs.Book_ID = b.Book_ID  

				AND b.Book_ID = g.Book_ID  

				AND b.Work_ID = w.Work_ID  

				AND b.Book_ID = ba.Book_ID 

				AND ba.Author_ID = a.Author_ID   

				GROUP BY a.Author_ID ;`
			}
		}
	}
	if (req.query.type === 'book') {
		if (!formattedQuery.genre) {
			if (!formattedQuery.series) {
				searchSql = `SELECT b.* 

				FROM book b, is_written_by ba, author a, work w  

				WHERE b.Book_Title LIKE '%${formattedQuery.title}%' 

				AND a.Author_Name LIKE '%${formattedQuery.author}%' 

				AND b.Book_Format LIKE '%${formattedQuery.format}%' 

				AND b.Book_Number_Of_Pages BETWEEN ${formattedQuery.pagefrom} AND ${formattedQuery.pageto} 

				AND w.Work_Original_Publish_Date BETWEEN ${formattedQuery.datefrom} AND ${formattedQuery.dateto} 

				AND b.Work_ID = w.Work_ID  

				AND b.Book_ID = ba.Book_ID 

				AND ba.Author_ID = a.Author_ID   

				GROUP BY b.Work_ID  

				ORDER BY b.Book_Average_Rating DESC;`
			} else {
				searchSql = `SELECT b.* 

				FROM book b, is_written_by ba, author a, is_part_of bs, series s, work w  

				WHERE b.Book_Title LIKE '%${formattedQuery.title}%' 

				AND a.Author_Name LIKE '%${formattedQuery.author}%' 

				AND s.Series_Name LIKE '%${formattedQuery.series}%' 

				AND b.Book_Format LIKE '%${formattedQuery.format}%' 

				AND b.Book_Number_Of_Pages BETWEEN ${formattedQuery.pagefrom} AND ${formattedQuery.pageto} 

				AND w.Work_Original_Publish_Date BETWEEN ${formattedQuery.datefrom} AND ${formattedQuery.dateto} 

				AND s.Series_ID = bs.Series_ID  

				AND bs.Book_ID = b.Book_ID  

				AND b.Work_ID = w.Work_ID  

				AND b.Book_ID = ba.Book_ID 

				AND ba.Author_ID = a.Author_ID   

				GROUP BY b.Work_ID  

				ORDER BY b.Book_Average_Rating DESC; `
			}
		} else {
			if (!formattedQuery.series) {
				searchSql = `SELECT b.* 

				FROM book b, is_written_by ba, author a, is_tagged_as g, work w  

				WHERE b.Book_Title LIKE '%${formattedQuery.title}%' 

				AND a.Author_Name LIKE '%${formattedQuery.author}%' 

				AND g.Genre_Name = '${formattedQuery.genre}' 

				AND b.Book_Format LIKE '%${formattedQuery.format}%' 

				AND b.Book_Number_Of_Pages BETWEEN ${formattedQuery.pagefrom} AND ${formattedQuery.pageto} 

				AND w.Work_Original_Publish_Date BETWEEN ${formattedQuery.datefrom} AND ${formattedQuery.dateto} 

				AND b.Book_ID = g.Book_ID  

				AND b.Work_ID = w.Work_ID  

				AND b.Book_ID = ba.Book_ID 

				AND ba.Author_ID = a.Author_ID   

				GROUP BY b.Work_ID  

				ORDER BY b.Book_Average_Rating DESC;`
			} else {
				searchSql = `SELECT b.* 

				FROM book b, is_written_by ba, author a, is_part_of bs, series s, is_tagged_as g, work w  

				WHERE b.Book_Title LIKE '%${formattedQuery.title}%' 

				AND a.Author_Name LIKE '%${formattedQuery.author}%' 

				AND s.Series_Name LIKE '%${formattedQuery.series}%' 

				AND g.Genre_Name = '${formattedQuery.genre}' 

				AND b.Book_Format LIKE '%${formattedQuery.format}%' 

				AND b.Book_Number_Of_Pages BETWEEN ${formattedQuery.pagefrom} AND ${formattedQuery.pageto} 

				AND w.Work_Original_Publish_Date BETWEEN ${formattedQuery.datefrom} AND ${formattedQuery.dateto} 

				AND s.Series_ID = bs.Series_ID  

				AND bs.Book_ID = b.Book_ID  

				AND b.Book_ID = g.Book_ID  

				AND b.Work_ID = w.Work_ID  

				AND b.Book_ID = ba.Book_ID 

				AND ba.Author_ID = a.Author_ID   

				GROUP BY b.Work_ID  

				ORDER BY b.Book_Average_Rating DESC;`
			}
		}
	}
	if (req.query.type === 'series') {
		const advancedSeriesSearchSql = (` IF ${req, query.genre} IS NULL OR ${req, query.genre} = "" THEN 

		SELECT b.* 

		FROM book b, is_written_by ba, author a, is_part_of bs, series s, work w  

		AND a.Author_Name LIKE '%${req, query.author}%' 

		AND s.Series_Name LIKE '%${req, query.title}%' 

		AND b.Book_Number_Of_Pages BETWEEN ${req, query.pagefrom} AND ${req, query.pageto} 

		AND w.Work_Original_Publish_Date BETWEEN ${req, query.datefrom} AND ${req, query.dateto} 

		AND s.Series_ID = bs.Series_ID  

		AND bs.Book_ID = b.Book_ID  

		AND b.Work_ID = w.Work_ID  

		AND b.Book_ID = ba.Book_ID 

		AND ba.Author_ID = a.Author_ID   

		GROUP BY s.Series_Name;  

ELSE 

		SELECT b.* 

		FROM book b, is_written_by ba, author a, is_part_of bs, series s, is_tagged_as g, work w  

		AND a.Author_Name LIKE '%${req, query.author}%' 

		AND s.Series_Name LIKE '%${req, query.title}%' 

		AND g.Genre_Name = '${req, query.genre}' 

		AND b.Book_Number_Of_Pages BETWEEN ${req, query.pagefrom} AND ${req, query.pageto} 

		AND w.Work_Original_Publish_Date BETWEEN ${req, query.datefrom} AND ${req, query.dateto} 

		AND s.Series_ID = bs.Series_ID  

		AND bs.Book_ID = b.Book_ID  

		AND b.Book_ID = g.Book_ID  

		AND b.Work_ID = w.Work_ID  

		AND b.Book_ID = ba.Book_ID 

		AND ba.Author_ID = a.Author_ID   

		GROUP BY  s.Series_Name;  

END IF; `)
		searchSql = advancedSeriesSearchSql
	}
	try {
		console.log(searchSql)
		const data = await queryMySql(searchSql)
		console.log(data)
		res.send(data)
		return
	} catch (e) {
		console.error(e)
		res.sendStatus(400)
		return
	}
})

// get all wishlist
app.get('/wishlist', async (req, res) => {
	console.log(req.query)
	const { User_ID } = req.query
	const getWishlistSql = (
		"SELECT b.* " +
		"FROM book b, adds_to_wishlist w " +
		"WHERE w.User_ID = " + User_ID + " " +
		"AND w.Book_ID = b.Book_ID;"
	)
	try {
		const data = await queryMySql(getWishlistSql)
		res.send(data)
	} catch (e) {
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
		"SELECT a.Author_ID " +
		"FROM author a, is_written_by w " +
		"WHERE w.Book_ID = " + Book_ID + " " +
		"AND w.Author_ID = a.Author_ID;"
	)
	const getSeriesSql = (
		"SELECT s.Series_ID " +
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
	const getSimilarSql = (
		"SELECT b.Book_ID " +
		"FROM is_similar_to s, book b " +
		"WHERE s.Book_ID_1 = " + Book_ID + " " +
		"AND s.Book_ID_2 = b.Book_ID;"
	)
	Promise.all([getBookSql,
		getAuthorSql,
		getSeriesSql,
		getGenreSql,
		getSimilarSql].map(x => queryMySql(x)))
		.then((data) => {
			let answer = {}
			answer = {
				...data[0][0],
				authors: data[1].map(a => a.Author_ID),
				series: data[2].map(s => s.Series_ID),
				genres: data[3],
				similarBooks: data[4].map(b => b.Book_ID)
			}
			console.log(answer)
			const getWorkSql = (
				"SELECT w.* " +
				"FROM work w " +
				"WHERE w.Work_ID = " + answer.Work_ID + ";"
			)
			if (!answer.Book_Title || answer.Book_Title === 'undefined') {
				res.status(404).send({ message: 'book not found' })
				return
			}
			queryMySql(getWorkSql)
				.then((data) => {
					answer = { ...answer, ...data[0] };
					return
				})
				.catch(err => {
					console.error('no work found for book', answer.Book_Name)
				})
				.finally(() => { res.send(answer) })
		}, (error) => {
			res.status(500).send(error)
		})
})

// get series details - everything related to a series by Series_ID
app.get('/series', (req, res) => {
	console.log(req.query)
	const Series_ID = req.query.id
	const getSeriesSql = `SELECT * FROM series where Series_ID = ${Series_ID};`
	const getBooksSql = "SELECT b.Book_ID " +
		"FROM book b, is_part_of p " +
		"WHERE p.Series_ID = " + Series_ID + " " +
		"AND p.Book_ID = b.Book_ID"
	const getAuthorSql = `SELECT a.Author_ID 
		FROM author a, is_written_by w, is_part_of p 
		WHERE p.Series_ID =  ${Series_ID}
		AND w.Author_ID = a.Author_ID 
		AND w.Book_ID = p.Book_ID 
		GROUP BY Author_ID;`
	Promise.all([getSeriesSql, getBooksSql, getAuthorSql].map(x => queryMySql(x)))
		.then(data => {
			let answer = {
				...data[0][0],
				books: data[1].map(b => b.Book_ID),
				authors: data[2].map(a => a.Author_ID)
			}
			res.send(answer)
			return
		}).catch(err => {
			res.status(400).send(err)
			return
		})
})

// get author details - everything related to a series by Series_ID
app.get('/author', (req, res) => {
	console.log(req.query)
	const Author_ID = req.query.id
	const getAuthorSql = `SELECT * FROM author where Author_ID = ${Author_ID};`
	const getBooksSql = `SELECT *  
		FROM (SELECT b.* 
		FROM book b, is_written_by w 
		WHERE w.Author_ID =  ${Author_ID}
		AND w.Book_ID = b.Book_ID 
		GROUP BY b.Work_ID) AS Works 
		GROUP BY Book_Title 
		ORDER BY Book_Average_Rating DESC;`
	const getSeriesSql = "SELECT s.Series_ID " +
		"FROM series s, is_part_of p, is_written_by w " +
		"WHERE w.Author_ID = " + Author_ID + " " +
		"AND w.Book_ID = p.Book_ID " +
		"AND p.Series_ID = s.Series_ID " +
		"GROUP BY s.Series_Name;"
	Promise.all([getAuthorSql, getBooksSql, getSeriesSql].map(x => queryMySql(x)))
		.then(data => {
			let answer = {
				...data[0][0],
				books: data[1].map(b => b.Book_ID),
				series: data[2].map(a => a.Series_ID)
			}
			res.send(answer)
			return
		}).catch(err => {
			res.status(400).send(err)
			return
		})
})

app.listen('3001', () => {
	console.log('server running on port 3001')
})