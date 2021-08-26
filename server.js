const express = require('express')
const routes = require('./routes')

const PORT = process.env.port || 3001
const app = express()


// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Controllers
app.use(routes)

// Init
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
})