const economy = require("../../Schema/economy-schema");
const { CommandInteraction,MessageEmbed, Client} = require("discord.js");

module.exports = {
    name: "bal",
    description: "check the balance of any user",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "user",
            description: "User to check his balance",
            required: false,
            type: "USER"
        }
    ],

/**
 * 
 * @param {CommandInteraction} interaction 
 * @param {Client} client 
 */

    async execute(interaction, client){
        const user = interaction.options.getUser("user") || interaction.user;
        let data = await economy.findOne({userID: user.id});
        if(!data){
            const embed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`**${user.username}** you're not registered in our database please contact any admin to register`)
            interaction.reply({embeds: [embed], ephemeral: true});
            return;
        }
        let totalMoney = data.money;
        let moneyBanked = data.moneyBank;
        const embed = new MessageEmbed()
        .setAuthor(user.tag, user.displayAvatarURL({dynamyc: true, size: 512}))
        .setThumbnail(user.displayAvatarURL({dynamyc: true, size: 512}))
        .setColor("GREEN")
        .setDescription(`Money: \`${totalMoney}\`\nMoney banked: \`${moneyBanked}\``);
        return interaction.reply({embeds: [embed], ephemeral: true})

    }
}