import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import pkg from 'pug';
import Config from './config.js';
import Notion from "./notion.js";

const {pug} = pkg;

const app = express();
app.set('view engine', 'pug');

app.use(express.static('static'))

app.listen(Config.serverPort, () => console.log(`Service started and listening on port ${Config.serverPort}`));

app.get("/", async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 

    const posts = await Notion.getPosts()
    console.log(`${ip} - Passing ${posts.length} items to view`)

    res.render('posts', {
        config: Config,
        posts: posts
    });
})

app.get("/:title", async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 

    const title = decodeURIComponent(req.params.title)
    const post = await Notion.getPost(title)
    console.log(`${ip} - Fetched post '${title}'`)
    
    if (post) {
        post.link = getPostLink(req)

        res.status(200.).render('post', {
            config: Config,
            post: post
        });
    
    } else {
        res.status(404).send("This article was not found")
    }    
    
})


const getPostLink = (req) => {
    return `${req.protocol}://${req.hostname}${req.url}`
}