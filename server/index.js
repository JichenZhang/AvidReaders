const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')

const app = express()
const allowedOrigins = ['http//localhost:3000']
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

app.get('/', (req, res) => {
  res.send('hello backend')
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
      db.query(findUserIDSql, (err, result)=>{
        if (err){
          console.error(err)
          res.sendStatus(500)
          return
        }
        console.log('userid=',result)
      })
    })
  })
  // res.send({ o: 'hello user' })
})

app.listen('3001', () => {
  console.log('server running on port 3001')
})