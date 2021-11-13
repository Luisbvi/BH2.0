const { GiveawaysManager } = require('discord-giveaways');

const giveawayModel = require("../Schema/GiveawayDB");

module.exports = (client) => {
    const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
        async getAllGiveaways() {
            // Get all giveaways from the database. We fetch all documents by passing an empty condition.
            return await giveawayModel.find().lean().exec();
        }
    
        async saveGiveaway(messageId, giveawayData) {
            // Add the new giveaway to the database
            await giveawayModel.create(giveawayData);
            // Don't forget to return something!
            return true;
        }
    
        async editGiveaway(messageId, giveawayData) {
            await giveawayModel.updateOne({ messageId }, giveawayData, { omitUndefined: true }).exec();
            return true;
        }
    
        async deleteGiveaway(messageId) {
            await giveawayModel.deleteOne({ messageId }).exec();
            return true;
        }
    };
    
    const manager = new GiveawayManagerWithOwnDatabase(client, {
        default: {
            botsCanWin: false,
            embedColor: '#FF0000',
            embedColorEnd: '#000000',
            reaction: '🎉'
        }
    });
    client.giveawaysManager = manager;

}

