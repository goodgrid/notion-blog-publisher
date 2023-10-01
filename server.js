import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import sassMiddleware from 'node-sass-middleware'
import pkg from 'pug';
import Config from './config.js';
import Notion from "./notion.js";

const {pug} = pkg;

const app = express();
app.set('view engine', 'pug');

app.use(sassMiddleware({
    src: path.join("./sass/", path.dirname(fileURLToPath(import.meta.url))),
    dest: path.join(path.dirname(fileURLToPath(import.meta.url)), 'assets/css'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/assets/css/'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));
//app.use('/public', express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));

app.use(express.static('static'))

app.listen(Config.serverPort, () => console.log(`Service started and listening on port ${Config.serverPort}`));

app.get("/", async (req, res) => {

    const posts = await Notion.getPosts()
    console.log(`Passing ${posts.length} items to view`)

    res.render('posts', {
        posts: posts
    });
})

app.get("/:title", async (req, res) => {
    const title = decodeURIComponent(req.params.title)
    const post = await Notion.getPost(title)
    if (post) {
        res.render('post', {
            post: post
        });
    
    }    
    res.status(404)
    res.send("This article was not found")
})