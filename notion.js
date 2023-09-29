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
                    }]
                }
                
            })
            return data.results.map(post => {
                console.log(post)
                return {
                    title: post.properties[Config.notionSchema.posts.properties.title].title[0].plain_text,
                    icon: (post.icon.external)?post.icon.external.url:"https://www.notion.so/icons/document_green.svg",
                    author: post.properties[Config.notionSchema.posts.properties.creator].created_by.id,
                    date: post.properties[Config.notionSchema.posts.properties.created].created_time,
                    summary: post.properties[Config.notionSchema.posts.properties.summary].rich_text[0].plain_text,
                }
            })
        } catch(error) {
            console.error("Error getting posts")
            console.error(error.response ? error.response.data : error.message)
        }
    
    },

    getPost: async (title) => {
        try {
            const { data } = await notionApi.post(`databases/${Config.notionSchema.posts.database}/query`, {
                
                "filter": {
                    "and": [{
                        "property": Config.notionSchema.posts.properties.title,
                        "title": {"equals": title }
                    }]
                }
                
            })

            if (data.results.length == 0) {
                return undefined
            } else {
                if (data.results.length > 1) {
                    console.error(`Oops, we found more than 1 article with that title. Returning the first only`)
                }
                const post = data.results[0]
                return {
                    title: post.properties[Config.notionSchema.posts.properties.title].title[0].plain_text,
                    author: post.properties[Config.notionSchema.posts.properties.creator].created_by.id,
                    date: post.properties[Config.notionSchema.posts.properties.created].created_time,
                    paragraphs: convertBlocks(await Notion.getBlocks(post.id))
                }

            }

        } catch(error) {
            console.error(`Error getting post ${title}`)
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
    

    }

}


export default Notion


const convertBlocks = (blocks) => {

    
    
    return blocks.map(block => {

        switch (block.type) {
            case "paragraph":
                //console.log(block)
                return {
                        type: "text",
                        content: (block.paragraph.rich_text[0])?block.paragraph.rich_text[0].plain_text:""
                    }
                    


            case "image":
                return {
                    type: "image",
                    url: block.image.file.url
                }

            default:
                console.error(`Oops, we encounted an unimplemented block type: ${block.type}`)
                console.error(block)
                return {}
        }

    })

    
}

