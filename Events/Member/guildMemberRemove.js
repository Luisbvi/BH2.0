const {MessageEmbed, WebhookClient, GuildMember} = require('discord.js');

module.exports = {
    name: "guildMemberRemove",

    /**
     * 
     * @param {GuildMember} member 
     */
    execute(member){

        const {user, guild} = member
    
        const Welcomer = new WebhookClient({
            id: "904145645055643678",
            token: "z1RY159VFNzaAloJF9c3rMHSaEaTY6mcgfqvME2R743hdkByBa2-SBTLTj4vejICPdTt"
        });

        const Welcome = new MessageEmbed()
        .setColor("AQUA")
        .setAuthor(user.tag, user.avatarURL({dynamic: true, size: 512}))
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`
        ${member} left from the comunity!\n
        Account Joined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>\n
        Latest Member Count: **${guild.memberCount}**`)
        .setFooter(`ID: ${user.id}`);

        Welcomer.send({embeds: [Welcome]});

    }
}