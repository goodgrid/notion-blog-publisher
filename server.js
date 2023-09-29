import express from 'express'
import pkg from 'pug';
import Config from './config.js';
import Notion from "./notion.js";

const {pug} = pkg;

const app = express();
app.set('view engine', 'pug');


app.listen(Config.serverPort, () => console.log(`Service started and listening on port ${Config.serverPort}`));

app.get("/", async (req, res) => {

    const posts = await Notion.getPosts()
    console.log(`Passing ${posts.length} items to view`)

    res.render('posts', {
        posts: posts
    });
})

app.get("/:title", async (req, res) => {

    const post = await Notion.getPost(req.params.title)
    if (post) {
        console.log(post.paragraphs)

        res.render('post', {
            post: post
        });
    
    }    
    res.status(404)
})