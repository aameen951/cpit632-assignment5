const express = require('express');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 80;

const BOOKS = JSON.parse(fs.readFileSync("./list_of_books.json", {encoding: 'utf-8'}));
BOOKS.forEach((book, idx) => book.id = idx+1);

app.get("/api/book/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if(isNaN(id) || id < 1 || id > BOOKS.length)res.status(404);
  else res.json(BOOKS[id-1]);
});

app.get("/api/books", (req, res) => {
  const clone = BOOKS.slice(0);
  const set = [];
  for(let i=0; i<10; i++) {
    const idx = Math.trunc(Math.random()*clone.length);
    set.push(clone[idx]);
    clone.splice(idx, 1);
  }
  res.json(set);
});

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Demo Application</title>
      <head>
      <body>
        <h2>Best Sellers</h2>
        <div id="output"></div>
        <script>
          (async function (){
            const response = await fetch('/api/books');
            const books = await response.json();
            for(let b of books) {
              const el = document.createElement('div');
              el.innerHTML = b.id + " - " + "<a href=\\"/book/" + b.id + "\\">" + b.title  + "</a>";
              output.appendChild(el);
            }
          })();
        </script>
      </body>
    </html>
  `);
});
app.get("/book/:id", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Demo Application</title>
      <head>
      <body>
        <h2>Book Info:</h2>
        <div id="output"></div>
        <script>
          (async function (){
            const response = await fetch('/api/book/${req.params.id}');
            const book = await response.json();
            output.innerHTML = \`
              <div>ID: \${book.id}</div>
              <div>Title: \${book.title}</div>
              <div>Year: \${book.year}</div>
              <div>Author: \${book.author}</div>
              <div>Language: \${book.language}</div>
              <div>Link: <a href="\${book.link}">\${book.link}</a></div>
              <div>Pages: \${book.pages}</div>
            \`;
            console.log(book);
          })();
        </script>
      </body>
    </html>
  `);
});

app.listen(PORT);