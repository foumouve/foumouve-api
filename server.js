let express = require('express')
let path = require('path')
const PORT = process.env.PORT || 8080
let bodyParser = require('body-parser')
let mongodb = require('mongodb')
let ObjectID = mongodb.ObjectID

let USERS_COLLECTION = 'users'

let app = express()
// app.use(express.static(__dirname + '/public'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

// store db connection in global variable to reuse it
let db

let uri
// uri = process.env.MONGODB_URI
uri = "mongodb+srv://admin:3irwHkcqCD3rXrjl@foumouve-cluster.egvk8.mongodb.net/foumove-api?retryWrites=true&w=majority"
console.log(uri)

// connect db before startiong app
// mongodb.MongoClient.connect(process.env.MONGODB_URI, function (error, database) {
mongodb.MongoClient.connect(uri, function (error, database) {
  if (error) {
    console.log(error)
    process.exit(1)
  }
  // store db object to reuse it
  db = database
  console.log('Database connection ready')

  // app init
  let server = app.listen(PORT, function () {
    let port = server.address().port
    console.log('App now running on port', port)
  })
})

// API BELLOW //

// error handler
const handleError = function (result, reason, message, code) {
  console.log('ERROR: ' + reason)
  result.status(code || 500).json({'error': message})
}

// user template
// {
//     "id": <ObjectId>
//     "username": <string>,
//     "email": <string>,
//     "password": <string>,
//     "gender": <string>, opt
//     "age": <int>, opt
//     "size": <int>, (cm) opt
//     "weight": <int>, (kg) opt
//     "friends": <user array>
//   }

/*  '/users'
*    GET: finds all users
*    POST: creates a new user
*/

app.get('/contacts', function(request, result) {
    db.collection(USERS_COLLECTION).find({}).toArray(function(error, documents) {
      if (error) {
        handleError(result, error.message, "Failed to get contacts.")
      } else {
        result.status(200).json(documents)
      }
    })
})

app.post('/contacts', function(request, result) {
    let user = request.body
    // user.createDate = new Date()

    if (!(request.body.username) || !(request.body.email) || !(request.body.password)) {
        handleError(result, "Données de l'utilisateur Invalides.", "Le nom d'utilisateur, l'email et le mot de passe sont obligatoire!", 400)
    }

    db.collection(USERS_COLLECTION).insertOne(user, function(error, document) {
        if (error) {
        handleError(result, error.message, "Échec de la création de l'utilisateur.")
        } else {
        res.status(201).json(document.ops[0])
        }
    })
})

/*  '/users/:id'
*    GET: find user by id
*    PUT: update user by id
*    DELETE: deletes user by id
*/

app.get('/contacts/:id', function(request, result) {
    db.collection(USERS_COLLECTION).findOne({ _id: new ObjectID(request.params.id) }, function(error, document) {
      if (error) {
        handleError(result, error.message, "Échec de la récupération de l'utilisateur.")
      } else {
        result.status(200).json(document)
      }
    })
})

app.put('/contacts/:id', function(request, result) {
    let updateDocument = request.body
    delete updateDocument._id
  
    db.collection(USERS_COLLECTION).updateOne({_id: new ObjectID(request.params.id)}, updateDocument, function(error, document) {
      if (error) {
        handleError(result, error.message, "Échec de la mise à jour de l'utilisateur.")
      } else {
        result.status(204).end()
      }
    })
})

app.delete('/contacts/:id', function(request, result) {
    db.collection(USERS_COLLECTION)
    .deleteOne({_id: new ObjectID(request.params.id)}, function(error, result) {
      if (error) {
        handleError(result, error.message, "Échec de la suppression de l'utilisateur.")
      } else {
        result.status(204).end()
      }
    })
})