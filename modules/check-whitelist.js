const fs = require('fs');
var whitelist = require('../data/whitelist.json');

// Checks if any date is expired and removes the role from the user
// Export the function so it can be used in other files
exports.checkWhitelist = function(interaction) {
    for (const userId in whitelist) {
        console.log(`[DEBUG] Checking id ${userId}`);
        var now = new Date();
        var user = whitelist[userId];
        if (user["until"] < now) {
            console.log(`[DEBUG] Removing whitelist for id ${userId}`);
            user = {};
            const member = interaction.guilds.member.cache.get(userId);
            const GPTrole = interaction.options.getRole('ChatGPT');
            if (member.roles.cache.some(GPTrole)) {
                member.roles.remove(GPTrole);
            }
            fs.writeFileSync('./data/whitelist.json', JSON.stringify(whitelist, null, 4)); // Write the changes to whitelist.json
            console.log(`Removed access for ${userId}`);
        }
    }
}