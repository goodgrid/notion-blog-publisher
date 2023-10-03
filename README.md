# Notion Blog Publisher


I like Notion and I like writing. Those two are a good combination and I love to just spill some thoughts in the tool I'm working in all day anyway. What I don't like is to open some other tool or website, log in, remember what it's quirks are and start writing there. I also don't like being dependent on other people to spill my thought over the internet. I LOVE re-using content from one hub onto different sites or processes.

After having published my website from Notion via the Fruition/Cloudflare approach, I now wanted to publish articles for a client on a clean, simple way, but again without having to leave Notion. I deciced to create a Notion database for my posts and connect to that from a Node Express server using the Notion API. I used a clean template called Jekyll Mediumish and changed Jekyll to Pug.

*The result is this project; Notion Blog Publisher.*

The idea in the end is to have a project that anyone can take and configure and have a clean  simple blog front-end on top of the Notion API. Currently, it's not there yet:
- Not everything is configurable. There are some fixed string with my cients name in the code
- It might turn out that the Notion API is too slow for this use case and some kind of caching (static markdown?) needs to be implemented
- Not every block type is currently handled. Especially annoying is the "unsupported" block type which is used when a link is used in a block...


This project is designed to be deployed on Render, hence the render.yaml. The Notion access token is supposed to be configured as an environment variable in Render.