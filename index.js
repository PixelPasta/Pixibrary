const express = require('express')
const app = express()
const fetch = require('node-fetch')
const port = process.env.PORT || 3000
app.set('view engine', 'ejs')


const controller = new AbortController()

// 5 second timeout:
const timeoutId = setTimeout(() => controller.abort(), 4000)





app.listen(port, () => {
    console.log(`Listening to ${port}`)
})
app.get('/', async (req, res) => {
  res.sendFile(__dirname+"/Pixibrary.html")
})

app.get('/status', async (req, res) => {
  return res.sendStatus(200)
})
app.get('/search', async (req, res) => {
if (!req.query.book) return res.redirect('./')

var fullUrl = req.protocol + '://' + req.get('host') ;
console.log(fullUrl)
    fulllUrl = fullUrl.replace("http", "https")
 response = await fetch(`${fullUrl}/e/?query=${req.query.book}`, )
 
     
response = await response.json()
if (response.error) return res.render('404')
console.log(response)
let bg = ['pink', 'rgb(167, 199, 231)', 'rgb(80, 200, 120)', 'lightsalmon' ]
let colors = ['pink', 'skyblue', 'lightgreen', 'lightsalmon' ]
let primary = ['red', 'blue', 'green', 'orangered']
let chosen = Math.floor(Math.random() * colors.length)

res.render('index', {uwu: colors[chosen],
prim: primary[chosen],
name: response.title,
bg: `${fullUrl}/img/?book=${req.query.book}`,
ing: response.categories,
auth: response.authors,
about: response.description,
publ: response.publisher,
public: response.publish_date,
pub: response.pageCount})
console.log(response.cover_image.replaceAll("amp;", ""))

})

app.get('/img', async (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host')
  let img = await fetch(`${fullUrl}/e/?query=${req.query.book}`)

    img = await img.json()
    img = await fetch(img.cover_image)
    img = await img.buffer()
    res.set('Content-Type', 'image/jpeg')
    res.end(img)
})

app.get('/410244.png', async (req, res) => {
    res.sendFile(__dirname+'/410244.png')
})

app.get('/book.png', async (req, res) => {
  res.sendFile(__dirname+"/closed-book-microsoft.png")
})

app.get('/e', async (req, res) => {
  console.log('Hi :)')
    let content = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${req.query.query}`)
    content = await content.json()
  if (content.totalItems === 0) return res.json({error: true})
  console.log(content)
    res.json({
        title: content.items[0].volumeInfo.title,
        authors: content.items[0].volumeInfo.authors,
        publisher: content.items[0].volumeInfo.publisher,
        publish_date: content.items[0].volumeInfo.publishedDate,
        description: content.items[0].volumeInfo.description,
        pageCount: content.items[0].volumeInfo.pageCount,
        categories: content.items[0].volumeInfo.categories,
        cover_image: content.items[0].volumeInfo.imageLinks.thumbnail

    })
})

