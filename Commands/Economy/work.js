const {CommandInteraction, MessageEmbed} = require('discord.js');
const economy = require('../../Schema/economy-schema');

module.exports = {
    name: "work",
    description: "Send your virtual account to work",

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction){
        let data = await economy.findOne({userID: interaction.user.id});
        if(!data){
            let newData = new economy({
                userID: interaction.user.id,
                money: 0,
                moneybank: 0
            });
            await newData.save();
            return interaction.reply({content: "You has been registered in the database, please use the command again."})
        }

        let totalMoney = data.money;

        let random = Math.floor(Math.random() * 325) + 150

        const embed = new MessageEmbed()
        .setTitle('Work')
        .setColor('DARK_RED')
        .setDescription(`The account botted and it make ${random}K`);

        await economy.findOneAndUpdate({userID: interaction.user.id}, {money: totalMoney + Number(random)})
        interaction.reply({embeds: [embed]});

    }
}