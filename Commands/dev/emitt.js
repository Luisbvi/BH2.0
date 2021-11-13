const {CommandInteraction, Client} = require('discord.js');
const { execute } = require('../Moderation/clear');

module.exports = {
    name: "emitt",
    description: "Event emitter",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "member",
            description: "Guild Member Event.",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "guildMemberAdd",
                    value: "guildMemberAdd",

                }, 
                {
                    name: "guildMemberRemove",
                    value: "guildMemberRemove",
                    
                }
            ] 
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client){
        const choices = interaction.options.getString("member");

        switch (choices) {
            case "guildMemberAdd": {
                
                client.emit('guildMemberAdd', interaction.member)
                interaction.reply({content: "Emitted the event.", ephemeral: true})                
            }
            break;
            case "guildMemberRemove": {
                
                client.emit('guildMemberAdd', interaction.member)
                interaction.reply({content: "Emitted the event.", ephemeral: true})
            }    
            break;
        }
    }
}