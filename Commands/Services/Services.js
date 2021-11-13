const service = require("../../Schema/service");
const { CommandInteraction, MessageEmbed, Client} = require("discord.js");
const {hiscores} = require("osrs-json-api");

module.exports = {
    name: "service",
    description: "Start services for any customer",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "start",
            description: "Start a services and register the details in the database",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "customer",
                    description: "Select the customer of the services to register him",
                    type: "USER",
                    required: true
                },
                {
                    name: "name",
                    description: "Name of the services you're regitering",
                    type: "STRING",
                    required: true
                },
                {
                    name: "rsn",
                    description:"Runescape name",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "actions",
            description: "Send updates for the customers",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "options",
                    description: "Select an option for the service",
                    type: "STRING",
                    required: true,
                    choices: [
                        {
                            name: "Update",
                            value: "Update"
                        },
                        {
                            name: "Auto Update",
                            value: "Auto Update"
                        },
                        {
                            name: "Finish",
                            value: "Finish"
                        },
                    ]
                },
                {
                    name: "code",
                    description: "The code for the services",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "upload",
            description: "Upload the details of any of the active services",
            type:"SUB_COMMAND",
            options: [
                {
                    name: "code",
                    description: "Code of the services",
                    type: "STRING",
                    required : true,

                },
                {
                    name: "day",
                    description: "Day of the service",
                    type: "STRING",
                    required: true
                },
                {
                    name: "hours",
                    description: "Hours worked",
                    type: "INTEGER",
                    required: true
                },
                {
                    name: "note",
                    description: "Send a note for the services",
                    type: "STRING",
                    required: false
                }
            ]
        }
    ],

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client){
        const { options } = interaction;
        const Sub = options.getSubcommand();

        const errEmbed = new MessageEmbed()
        .setColor("RED");

        const SucessEmbed = new MessageEmbed()
        .setColor("GREEN");

        switch (Sub) {
            case "start": {
                const rsn = interaction.options.getString("rsn");
                const hiscore = await hiscores.getPlayer(rsn);
                const customer = options.getUser("customer");
                function code(length) {
                    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    var random_string = '';
                    if(length > 0 ){
                        for (var i = 0; i < length; i++){
                            random_string += chars.charAt(Math.floor(Math.random() * chars.length))                           
                            
                        }
                    }
                    return random_string
                    
                }
                code = code(4)
                let newData = new service({
                    code: code,
                    nameOfServices: options.getString("name"),
                    customerId: customer.id,
                    rsn: options.getString("rsn"),
                    status: "RUNNING",
                    day: 0,
                    hoursWorked: 0,
                    experience: hiscore["skills"]["overall"]["xp"],
                    note: "Starting services",
                    avatar: customer.avatarURL(),
                    customerName: customer.username

                });
                
                await newData.save()
                .then(async () => {
                    SucessEmbed.setDescription(`Services registered in the database the order number is ${code}.`)
                    return interaction.reply({embeds: [SucessEmbed], ephemeral: true});
                }).catch((err) =>{
                    errEmbed.setDescription(`An error has occurred\n\`${err}\``)
                    return interaction.reply({embeds: [errEmbed]});
                });

            }
                break;
        
            case "actions": {
                const choices = options.getString("options");
                const code = options.getString("code");
                const data = await service.findOne({code: code});
                        if(!data){
                            errEmbed.setDescription("Ticket don't exist, try again");
                            return interaction.reply({embeds: [errEmbed], ephemeral: true});
                        }
                const rsn = data.rsn;
                const hiscore = await hiscores.getPlayer(rsn);
                switch (choices) {
                    case "Update": {
                        SucessEmbed
                        .setTitle(`${data.nameOfServices} Update`)
                        .setDescription(`**STATUS**: \`${data.status}\`\n
                        **DAY**: \`${data.day}\`\n
                        **HOURS WORKED**: \`${data.hoursWorked}\`\n
                        **EXPERIENCE GAINED**: \`${(hiscore["skills"]["overall"]["xp"] - data.experience)/ 1000}K\`\n
                        **NOTE**: \`${data.note}\``)
                        .setThumbnail(data.avatar)
                        .setTimestamp();

                        const embed = new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle(rsn)
                        .addFields(
                            {name: "Attack", value: hiscore["skills"]["attack"]["level"], inline: true},
                            {name: "Hitpoints", value: hiscore["skills"]["hitpoints"]["level"], inline: true},
                            {name: "Mining", value: hiscore["skills"]["mining"]["level"], inline: true},
                            {name: "Strength", value: hiscore["skills"]["strength"]["level"], inline: true},
                            {name: "Agility", value: hiscore["skills"]["agility"]["level"], inline: true},
                            {name: "Smithing", value: hiscore["skills"]["smithing"]["level"], inline: true},
                            {name: "Defence", value: hiscore["skills"]["defence"]["level"], inline: true},
                            {name: "Herblore", value: hiscore["skills"]["herblore"]["level"], inline: true},
                            {name: "Fishing", value: hiscore["skills"]["fishing"]["level"], inline: true},
                            {name: "Ranged", value: hiscore["skills"]["ranged"]["level"], inline: true},
                            {name: "Thieving", value: hiscore["skills"]["thieving"]["level"], inline: true},
                            {name: "Cooking", value: hiscore["skills"]["cooking"]["level"], inline: true},
                            {name: "Prayer", value: hiscore["skills"]["prayer"]["level"], inline: true},
                            {name: "Crafting", value: hiscore["skills"]["crafting"]["level"], inline: true},
                            {name: "Firemaking", value: hiscore["skills"]["firemaking"]["level"], inline: true},
                            {name: "Magic", value: hiscore["skills"]["magic"]["level"], inline: true},
                            {name: "Fletching", value: hiscore["skills"]["fletching"]["level"], inline: true},
                            {name: "Woodcutting", value: hiscore["skills"]["woodcutting"]["level"], inline: true},
                            {name: "Runecraft", value: hiscore["skills"]["runecraft"]["level"], inline: true},
                            {name: "Slayer", value: hiscore["skills"]["slayer"]["level"], inline: true},
                            {name: "Farming", value: hiscore["skills"]["farming"]["level"], inline: true},
                            {name: "Construction", value: hiscore["skills"]["construction"]["level"], inline: true},
                            {name: "Hunter", value: hiscore["skills"]["hunter"]["level"], inline: true},
                            {name: "Total", value: hiscore["skills"]["overall"]["level"], inline: true},
                
                        ) 
                        await service.findOneAndUpdate({code: code}, {experience: hiscore["skills"]["overall"]["xp"]});                      

                        interaction.reply({content: "Update send", ephemeral: true})
                        interaction.channel.send({content: `<@${data.customerId}> Here is the update for today`, embeds: [SucessEmbed, embed], ephemeral: true})       
                    }
                        break;
                
                    case "Auto Update": {
                        SucessEmbed
                        .setTitle(`${data.nameOfServices} Update`)
                        .setDescription(`**STATUS**: \`${data.status}\`\n
                        **DAY**: \`${data.day}\`\n
                        **HOURS WORKED**: \`${data.hoursWorked}\`\n
                        **EXPERIENCE GAINED**: \`${(hiscore["skills"]["overall"]["xp"] - data.experience)/ 1000}K\`\n
                        **NOTE**: \`${data.note}\``)
                        .setThumbnail(data.avatar)
                        .setTimestamp()
                        interaction.reply({content: "AutoUpdate set", ephemeral: true})
                        
                        const embed = new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle(rsn)
                        .addFields(
                            {name: "Attack", value: hiscore["skills"]["attack"]["level"], inline: true},
                            {name: "Hitpoints", value: hiscore["skills"]["hitpoints"]["level"], inline: true},
                            {name: "Mining", value: hiscore["skills"]["mining"]["level"], inline: true},
                            {name: "Strength", value: hiscore["skills"]["strength"]["level"], inline: true},
                            {name: "Agility", value: hiscore["skills"]["agility"]["level"], inline: true},
                            {name: "Smithing", value: hiscore["skills"]["smithing"]["level"], inline: true},
                            {name: "Defence", value: hiscore["skills"]["defence"]["level"], inline: true},
                            {name: "Herblore", value: hiscore["skills"]["herblore"]["level"], inline: true},
                            {name: "Fishing", value: hiscore["skills"]["fishing"]["level"], inline: true},
                            {name: "Ranged", value: hiscore["skills"]["ranged"]["level"], inline: true},
                            {name: "Thieving", value: hiscore["skills"]["thieving"]["level"], inline: true},
                            {name: "Cooking", value: hiscore["skills"]["cooking"]["level"], inline: true},
                            {name: "Prayer", value: hiscore["skills"]["prayer"]["level"], inline: true},
                            {name: "Crafting", value: hiscore["skills"]["crafting"]["level"], inline: true},
                            {name: "Firemaking", value: hiscore["skills"]["firemaking"]["level"], inline: true},
                            {name: "Magic", value: hiscore["skills"]["magic"]["level"], inline: true},
                            {name: "Fletching", value: hiscore["skills"]["fletching"]["level"], inline: true},
                            {name: "Woodcutting", value: hiscore["skills"]["woodcutting"]["level"], inline: true},
                            {name: "Runecraft", value: hiscore["skills"]["runecraft"]["level"], inline: true},
                            {name: "Slayer", value: hiscore["skills"]["slayer"]["level"], inline: true},
                            {name: "Farming", value: hiscore["skills"]["farming"]["level"], inline: true},
                            {name: "Construction", value: hiscore["skills"]["construction"]["level"], inline: true},
                            {name: "Hunter", value: hiscore["skills"]["hunter"]["level"], inline: true},
                            {name: "Total", value: hiscore["skills"]["overall"]["level"], inline: true},
                
                        )
                        setInterval(() => {
                            service.findOneAndUpdate({code: code}, {experience: hiscore["skills"]["overall"]["xp"]});
                            interaction.channel.send({content: `<@${data.customerId}> Here is the update for today`, embeds: [SucessEmbed, embed]});
                        }, 86400000);
                    }
                        break;
                    
                    case "Finish": {
                        
                        await data.delete()
                        SucessEmbed
                        .setDescription(`The services has been finished please check the account`)
                        interaction.reply({content: `<@${data.customerId}>`, embeds :[SucessEmbed]});
                        
                    }
                        break;

                }
            }
                break;

            case "upload": {
                const code = options.getString("code");
                const hours = options.getInteger("hours");
                let note = options.getString("note");
                const day = options.getString("day");
                const data = await service.findOne({code: code});
                if(!data){
                    errEmbed.setDescription("Ticket don't exist, try again");
                    return interaction.reply({embeds: [errEmbed], ephemeral: true});
                }
                if(!note){
                    note = "Working"
                }
                await service.findOneAndUpdate({code: code}, { day: day, hoursWorked: hours, note: note}).catch((err) =>{
                    return console.log(err);
                });
                SucessEmbed.setDescription("Service updated in the database")
                interaction.reply({embeds: [SucessEmbed], ephemeral: true})
            }
        }

    }

}