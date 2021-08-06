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
      }else{
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
    return
  })
})
// create account
app.post('/user', (req, res) => {
  console.log(req.body)
  const findUserSql = "SELECT * " +
    "FROM user " +
    "WHERE User_Login = '" + req.body.login + "' " +
    "AND User_Password = '" + req.body.password + "';";
  const createUserSql = (
    "INSERT INTO user (User_Login,User_Password, User_Name) " +
    "VALUES ('" + req.body.login + "', '" + req.body.password + "', '" + req.body.name + "');"
  )
  const findUserIDSql = (
    "SELECT User_ID " +
    "FROM user " +
    "WHERE User_Login = '" + req.body.login + "';"
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
// get book details
app.get('/book', (req, res) => {
  console.log(req.query)
  const { Book_ID } = req.query
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
  Promise.all([getAuthorSql, getSeriesSql, getGenreSql].map(x=>queryMySql(x))).then((data)=>{
    answer = {}
    for (let x of data){
      answer = {...answer, ...x}
    }
    res.send(answer)
  },(error)=>{
    res.status(500).send(error)
  })
})

app.listen('3001', () => {
  console.log('server running on port 3001')
})