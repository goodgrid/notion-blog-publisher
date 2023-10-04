import Secrets from "./secrets.js";

const Config = {
    serverPort: 8080,
    notionToken: (process.env.NOTION_TOKEN)?process.env.NOTION_TOKEN:Secrets.notionToken,
    notionApiVersion: '2022-06-28',
    content: {
        title: "Biztech Foundation Blog",
        tagline: "Artikelen op het raakvlak van organisatie-ontwerp en technologie",
        subject: 'CloudGuide blog op het raakvlak van organisatie-ontwerp en technologie',
        logo: "https://www.cloudguide.nl/static/img/logo.svg",
        subscriptionUrl: 'https://cloudguide.us8.list-manage.com/subscribe/post?u=719a440ea3eab186ad5a63e8f&id=57cdbb3c99',
        corporateUrl: 'https://www.cloudguide.nl',
        language: "nl_NL",
        headerRecent: "Recente artikelen"
    },
    notionSchema: {
        posts: {
            database: "ba08672c533f4bef9052bf4e8abeaff5", 
            properties: {
                path: "path",
                title: "Name",
                created: "Created time",
                creator: "Created by",
                authorIntro: "Author intro",
                published: "Gepubliceerd",
                summary: "AI summary",

            }
        }
    }
 
}

export default Config