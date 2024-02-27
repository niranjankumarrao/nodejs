const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
app.use(express.json())
const path = require('path')
const dbPath = path.join(__dirname, 'moviesData.db')
let db = null

const initiateDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => console.log('success'))
  } catch (e) {
    console.log(`DB error ${e.message}`)
    process.exit(1)
  }
}

initiateDbAndServer()

const convertDbObjectToResponseObject = result => {
  return {
    movieId: result.movie_id,
    directorId: result.director_id,
    movieName: result.movie_name,
    leadActor: result.lead_actor,
  }
}

app.get('/movies/', async (request, response) => {
  const getOb = `
    SELECT
      movie_name
    FROM
      Movie`
  const arrayOb = await db.all(getOb)
  response.send(arrayOb.map(each => ({movieName: each.movie_name})))
})

app.post('/movies/', async (request, response) => {
  const inputBody = request.body
  const {directorId, movieName, leadActor} = inputBody
  const add = `
    INSERT INTO
     movie(director_id,movie_name,lead_actor)
    VALUES(${directorId},'${movieName}','${leadActor}')`
  await db.run(add)
  response.send('Movie Successfully Added')
})

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getOb = `
    SELECT
      *
    FROM
      movie
    WHERE
      movie_id=${movieId};`
  const result = await db.get(getOb)
  response.send(convertDbObjectToResponseObject(result))
})

app.put('/movies/:movieId/', async (request, response) => {
  const {directorId} = request.params
  const {director}
})
module.exports = app
