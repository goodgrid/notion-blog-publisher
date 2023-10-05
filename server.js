import express from 'express'
import pkg from 'pug';
import Notion from "./notion.js";
import Config from './config.js';

const {pug} = pkg;

const app = express();
app.set('view engine', 'pug');

app.use(express.static('static'))

app.listen(Config.serverPort, () => console.log(`Service started and listening on port ${Config.serverPort}`));

app.get("/", async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 

    const posts = await Notion.getPosts()
    if (posts) {
        console.log(`${ip} - Passing ${posts.length} items to view`)

        res.render('posts', {
            config: Config,
            posts: posts
        });
    } else {
        res.status(500).send("Unexpected result while fetching posts")
    }
})

app.get("/:path", async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 

    const path = req.params.path
    const post = await Notion.getPost(path)
    console.log(`${ip} - Fetched post '${path}'`)
    
    if (post) {
        post.link = getPostLink(req)
        post.cover = `${post.cover}&w=1200`

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