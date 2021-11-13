const {CommandInteraction, MessageEmbed, Client} = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "giveaway",
    description: "Run a giveaway in our discord server",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "start",
            description: "Start a complete giveaway",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "duration",
                    description: "Provide a duration for this giveaway (1m, 1h, 1d).",
                    type: "STRING",
                    required: true,
                },
                {
                    name: "winners",
                    description: "Select the amount of winner for this giveaway.",
                    type: "INTEGER",
                    required: true,
                },   
                {
                    name:"prize",
                    description: "Provide the name of the prize.",
                    type:"STRING",
                    required: true
                },
                {
                    name: "channel",
                    description: "Select a channel to send the giveaway to.",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"]
                }    
            ]
        },
        {
            name: "actions",
            description:"Options for giveaways.",
            type: "SUB_COMMAND",
            options: [
                {
                   name: "options",
                   description: "Select a option.",
                   type: "STRING",
                   required: true,
                   choices: [
                       {
                           name: "end",
                           value: "end"
                       },
                       {
                            name: "pause",
                            value: "pause"
                        },
                        {
                            name: "unpause",
                            value: "unpause"
                        },
                        {
                            name: "reroll",
                            value: "reroll"
                        },
                        {
                            name: "delete",
                            value: "delete"
                        }
                   ] 
                },
                {
                    name: "message_id",
                    description: "Provide the message ID for the giveaway",
                    type: "STRING",
                    required: true
                }
            ]
        }
        
    ],
    
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    
    execute(interaction ,client){  
        const { options } = interaction;

        const Sub = options.getSubcommand();

        const errEmbed = new MessageEmbed()
        .setColor("RED");

        const SucessEmbed = new MessageEmbed()
        .setColor("GREEN");

        switch (Sub) {
            case "start": {
                const gchannel = options.getChannel("channel") || interaction.channel;
                const duration = options.getString("duration");
                const winnerCount = options.getInteger("winners");
                const prize = options.getString("prize");

                client.giveawaysManager.start(gchannel, {
                    duration: ms(duration),
                    winnerCount,
                    prize,
                    messages : {
                        giveaway: "🎉 **GIVEAWAY STARTED** 🎉",
                        giveawayEnded: "🎊 **GIVEAWAY ENDED** 🎉",
                        winMessage: "'Congratulations, {winners}! You won **{this.prize}**!'"
                    }
                }).then(async () => {
                    SucessEmbed.setDescription("Giveaway was successfully started.")
                    return interaction.reply({embeds: [SucessEmbed], ephemeral: true});
                }).catch((err) =>{
                    errEmbed.setDescription(`An error has occurred\n\`${err}\``)
                    return interaction.reply({embeds: [errEmbed], ephemeral: true});
                });
    
            }
            break;

            case "actions": {
                const choice = options.getString("options");
                const messageId = options.getString("message_id");
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);
                
                // If no giveaway was found
                if (!giveaway){
                    errEmbed.setDescription(`Unable to find the giveaway with the message id: ${messageId} in this guild`);
                    return interaction.reply({embeds: [errEmbed], ephemeral: true});
                }

                switch (choice) {
                    case "end": {
                        client.giveawaysManager.end(messageId).then(() => {
                            SucessEmbed.setDescription("Giveaway has been ended.");
                            return interaction.reply({embeds: [SucessEmbed], ephemeral: true})
                        }).catch((err) => {
                            errEmbed.setDescription(`Unable to find the giveaway with the message id: ${messageId} in this guild`);
                            return interaction.reply({embeds: [errEmbed], ephemeral: true});
                        });

                    }
                    break;

                    case "pause": {
                        client.giveawaysManager.pause(messageId).then(() => {
                            SucessEmbed.setDescription("Giveaway has been pause.");
                            return interaction.reply({embeds: [SucessEmbed], ephemeral: true})
                        }).catch((err) => {
                            errEmbed.setDescription(`Unable to find the giveaway with the message id: ${messageId} in this guild`);
                            return interaction.reply({embeds: [errEmbed], ephemeral: true});
                        });
                        

                    }
                    break;

                    case "unpause": {
                        client.giveawaysManager.unpause(messageId).then(() => {
                            SucessEmbed.setDescription("Giveaway has been unpause.");
                            return interaction.reply({embeds: [SucessEmbed], ephemeral: true})
                        }).catch((err) => {
                            errEmbed.setDescription(`Unable to find the giveaway with the message id: ${messageId} in this guild`);
                            return interaction.reply({embeds: [errEmbed], ephemeral: true});
                        });

                    }
                    break;

                    case "delete": {
                        client.giveawaysManager.delete(messageId).then(() => {
                            SucessEmbed.setDescription("Giveaway has delete.");
                            return interaction.reply({embeds: [SucessEmbed], ephemeral: true})
                        }).catch((err) => {
                            errEmbed.setDescription(`Unable to find the giveaway with the message id: ${messageId} in this guild`);
                            return interaction.reply({embeds: [errEmbed], ephemeral: true});
                        });

                    }
                    break;

                    case "reroll": {
                        client.giveawaysManager.reroll(messageId).then(() => {
                            SucessEmbed.setDescription("Giveaway has been rerolled.");
                            return interaction.reply({embeds: [SucessEmbed], ephemeral: true})
                        }).catch((err) => {
                            errEmbed.setDescription(`Unable to find the giveaway with the message id: ${messageId} in this guild`);
                            return interaction.reply({embeds: [errEmbed], ephemeral: true});
                        });
                    }
                    break;
                }

            }
            break;

            default: {
                console.log("Error in giveaway command");
            }
        
           
        }

    }
}