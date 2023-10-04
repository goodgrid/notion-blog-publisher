import axios from "axios";
import Config from "./config.js";

const notionApi = axios.create({
    baseURL: 'https://api.notion.com/v1/',
    headers: {
        'Authorization': `Bearer ${Config.notionToken}`,
        accept: 'application/json',
        'Notion-Version': Config.notionApiVersion,
        'content-type': 'application/json'
    } 
})



const Notion = {
    getPosts: async () => {
        try {
            const { data } = await notionApi.post(`databases/${Config.notionSchema.posts.database}/query`, {
                
                "filter": {
                    "and": [{
                        "property": Config.notionSchema.posts.properties.published,
                        "checkbox": {"equals": true }
                    },{
                        "property": Config.notionSchema.posts.properties.path,
                        "rich_text": {"is_not_empty": true}
                    }]
                }
                
            })
            return Promise.all(data.results.map(async post => {

                return {
                    path: (post.properties["path"].rich_text.length>0)?post.properties["path"].rich_text[0].plain_text:"/", 
                    title: post.properties[Config.notionSchema.posts.properties.title].title[0].plain_text,
                    cover: (post.cover && post.cover.external)?post.cover.external.url:"https://www.notion.so/icons/document_green.svg",
                    author: await Notion.getUser(post.properties[Config.notionSchema.posts.properties.creator].created_by.id),
                    authorIntro: (post.properties[Config.notionSchema.posts.properties.authorIntro].rich_text[0])?post.properties[Config.notionSchema.posts.properties.authorIntro].rich_text[0].plain_text:"Intro wordt nog gegenereerd door Notion IA",
                    date: localizeDate(post.properties[Config.notionSchema.posts.properties.created].created_time),
                    summary: truncateText((post.properties[Config.notionSchema.posts.properties.summary].rich_text[0])?post.properties[Config.notionSchema.posts.properties.summary].rich_text[0].plain_text:"Samenvatting is nog niet beschikbar. Klik om het artikel te lezen"),
                }
            }))
        } catch(error) {
            console.error("Error getting posts")
            console.error(error.response ? error.response.data : error.message)
            
        }
    
    },

    getPost: async (path) => {
        try {
            const { data } = await notionApi.post(`databases/${Config.notionSchema.posts.database}/query`, {
                
                "filter": {
                    "and": [{
                        "property": Config.notionSchema.posts.properties.path,
                        "rich_text": {"equals": path }
                    }]
                }
                
            })

            if (data.results.length == 0) {
                return undefined
            } else {
                if (data.results.length > 1) {
                    console.error(`Oops, we found more than one article with that path. Returning the first only`)
                }
                const post = data.results[0]
                return {
                    title: post.properties[Config.notionSchema.posts.properties.title].title[0].plain_text,
                    cover: (post.cover && post.cover.external)?post.cover.external.url:"https://www.notion.so/icons/document_green.svg",
                    author: await Notion.getUser(post.properties[Config.notionSchema.posts.properties.creator].created_by.id),
                    authorIntro: (post.properties[Config.notionSchema.posts.properties.authorIntro].rich_text[0])?post.properties[Config.notionSchema.posts.properties.authorIntro].rich_text[0].plain_text:"Intro wordt nog gegenereerd door Notion IA",
                    date: localizeDate(post.properties[Config.notionSchema.posts.properties.created].created_time),
                    summary: truncateText((post.properties[Config.notionSchema.posts.properties.summary].rich_text[0])?post.properties[Config.notionSchema.posts.properties.summary].rich_text[0].plain_text:"Samenvatting is nog niet beschikbar. Klik om het artikel te lezen"),
                    paragraphs: convertBlocks(await Notion.getBlocks(post.id))
                }

            }

        } catch(error) {
            console.error(`Error getting post ${path}`)
            console.error(error.response ? error.response.data : error.message)
        }
    
    },

    getBlocks: async (pageId) => {
        try {
            const { data } = await notionApi.get(`blocks/${pageId}/children`)
            return data.results
        } catch(error) {
            console.error(`Error getting content for page  ${pageId}`)
            console.error(error.response ? error.response.data : error.message)
        }
    

    },

    getUser: async (userId) => {
        try {
            const { data } = await notionApi.get(`users/${userId}`)
            
            return {
                name: data.name,
                avatar: data.avatar_url,
            }
        } catch(error) {
            console.error(`Error gettinguser  ${userId}`)
            console.error(error.response ? error.response.data : error.message)
        }

    }

}


export default Notion


const localizeDate = (dt) => {
    const dateObject = new Date(dt)
    return dateObject.toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const truncateText = (string, length) => {
    if (string.length > 500) {
        string = string.substring(0,500) + "..."
    }
    return string
}

const convertBlocks = (blocks) => {

    return blocks.map(block => {

        switch (block.type) {
            case "paragraph":
                return {
                        type: "text",
                        content: (block.paragraph.rich_text[0])?block.paragraph.rich_text[0].plain_text:""
                    }
            case "image":
                return {
                    type: "image",
                    url: block.image.file.url
                }
                case "bulleted_list_item":
                    return {
                        type: "bulleted_list_item",
                        content: block.bulleted_list_item.rich_text[0].plain_text
                    }
                case "heading_2":
                    return {
                        type: "heading_2",
                        content: block.heading_2.rich_text[0].plain_text
                    }
                case "video":
                    return {
                        type: "video",
                        content: block.video.file.url
                    }
                default:
                    console.error(`Oops, we encounted an unimplemented block type: ${block.type}`)
                    return {}
        }

    })

    
}

