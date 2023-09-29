import Secrets from "./secrets.js";

const Config = {
    serverPort: 8080,
    notionToken: (process.env.NOTION_TOKEN)?process.env.NOTION_TOKEN:Secrets.notionToken,
    notionApiVersion: '2022-06-28',
    notionSchema: {
        posts: {
            database: "ba08672c533f4bef9052bf4e8abeaff5", 
            properties: {
                title: "Name",
                created: "Created time",
                creator: "Created by",
                published: "Gepubliceerd",
                summary: "AI summary",

            }
        }
    }
 
}

export default Config