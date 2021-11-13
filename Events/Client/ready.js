const { Client } = require('discord.js');
const mongoose = require("mongoose");
const youtube = require("../../Schema/youtube");
const { getChannelVideos } = require('yt-channel-info');


module.exports = {
    name: "ready",
    once: true,

    /**
     * 
     * @param {Client} client 
     */

    async execute(client){
        console.log("Bot ready!");
        client.user.setActivity("Old schoold runescape", {type: "COMPETING"});

        if(!process.env.DATABASE) return
        mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(()=>{
            console.log("The client is now connected to the database!");
        }).catch(err =>{
            console.log(err);
        });
        
        const db = require('megadb');
        const yt = new db.crearDB("yt");

        setInterval(async function(){
            const vids = await getChannelVideos("NotABotRuneScape", 0);   
            const lastVid = vids.items[0];
            const ytTitle = await yt.obtener("NotABotRuneScape");
            if(ytTitle === lastVid.title) return
            if(ytTitle !== lastVid.title){
                yt.establecer("NotABotRuneScape", lastVid.title);
                client.channels.cache.get("855859801636077648").send(`${lastVid.author} uploaded a new video: \n**${lastVid.title}**\nhttps://www.youtube.com/watch?v=${lastVid.videoId}`);
            }
        }, 60000);
        
    } 
}