const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
app.use(express.json())
app.get('/', (req, res) => {
 res.send('Attendance management System')
})
app.get('/attendance', (req, res) => {
 res.send('Attendance')
})
app.get('/subject', (req, res) => {
 res.send('Subject')
})
app.get('/lecturer', (req, res) => {
 res.send('Lecturer')
})


app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
})