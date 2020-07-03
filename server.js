// process.env.MONGODB_URI
let express = require('express')
let path = require('path')
let bodyParser = require('body-parser')
let mongodb = require('mongodb')
let ObjectID = mongodb.ObjectID

let USERS_COLLECTION = 'users'

let app = express()
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
let db

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  // Save database object from the callback for reuse.
  db = database
  console.log('Database connection ready')

  // Initialize the app.
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port
    console.log('App now running on port', port)
  })
})

// MY API ROUTES BELOW