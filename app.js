const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname,'/public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'myblogpage'
})

app.set('view-engine','ejs');

//connecting to database
db.connect((err) => {
    if(err)
        throw err;
    console.log('MySQL Database Connected...')
})

//Viewing the blog
app.get('/',(req,res) => {
    let sql = 'SELECT * FROM posts';
    db.query(sql,(err,results) => {
        if(err)
            throw err;
        console.log('A GET request is initiated...  Someone is reading the blogs...');
        res.render(path.join(__dirname,'/public','index.ejs'),{ results: results });
    })
})

// login page
app.get('/login',(req,res) => {
    res.render(path.join(__dirname,'/public','login.ejs'));
    console.log('Login page..')
})

// main page
app.get('/mainpage',(req,res) => {
    let sql = 'SELECT * FROM posts';
    db.query(sql,(err,results) => {
        if(err)
            throw err;
        console.log('A GET request is initiated...  User on his profile...');
        res.render(path.join(__dirname,'/public','main_page.ejs'),{ results: results });
    })
})

// edit page
app.get('/edit/:id',(req,res) => {
    let sql = `SELECT * FROM posts WHERE id=${req.params.id}`;
    db.query(sql,(err,result) => {
        if(err)
            throw err;
        console.log('A GET request is initiated...  A blog is on edit page...');
        res.render(path.join(__dirname,'/public','edit_page.ejs'),{ result: result });
    })
})

// updating post
app.post('/edit/update',(req,res) => {
    let post = {id: req.body.id, title: req.body.title, body: req.body.body};
    let sql = `UPDATE posts SET title = '${post.title}', body = '${post.body}' WHERE id=${post.id}`;
    db.query(sql,(err,result) => {
        if(err)
            throw err;
        console.log('A GET request is initiated...  A blog is updated...');
        res.redirect('/mainpage');
    })
})

// deleting a post
app.get('/delete/:id',(req,res) => {
    let sql = `DELETE FROM posts WHERE id=${req.params.id}`;
    db.query(sql,(err,result) => {
        if(err)
            throw err;
        console.log('A GET request is initiated...  A blog is deleted...');
        res.redirect('/mainpage');
    })
})

//opening the add window
app.get('/addpostpage',(req,res) => {
    res.render(path.join(__dirname,'/public','add_page.ejs'));
})

//Adding to blog
app.post('/addpostpage/addpost',(req,res) => {
    let post = {title: req.body.title, body: req.body.body};
    let sql = 'INSERT INTO posts SET ?';
    db.query(sql,post,(err,result) => {
        if(err)
            throw err;
        console.log('A POST request is initiated...    One blog added...');
        res.redirect('/');
    })
})

app.get('/createpoststable',(req,res) => {
    let sql = 'CREATE TABLE posts(id INT AUTO_INCREMENT,title VARCHAR(255), time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,body VARCHAR(2000), PRIMARY KEY(id))';
    db.query(sql,(err,result)=>{
        if(err)
            throw err;
        console.log(result);
        console.log('Posts table created...');
        res.redirect('/addpostpage');
    })
});

const port = process.env.PORT || 3000;

app.listen(port,() => console.log(`Listening on port ${port}...`));