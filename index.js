const express = require('express')
const routes = require('./server/routes')

const app = express()

app.get('/', (req,res) => {
  res.json({
    meta: {
      code: 200,
      error: null,
      message: 'API server is running.',
    },
  })
})

app.use('/', [
	routes.posts,
	routes.comments,
])

app.listen(process.env.port || 3000)
console.log('Web Server is listening at port '+ (process.env.port || 3000))

