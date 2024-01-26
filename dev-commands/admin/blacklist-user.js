const {SlashCommandBuilder} = require('discord.js');
const fs = require('fs');

module.exports = { 
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blacklist a user from GPT-Chan.')
        .addUserOption(option => option.setName('user').setDescription('The user to blacklist.').setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        await interaction.reply('blacklisting user...');
        var blacklist = require('../../data/blacklist.json');
        const user = interaction.user;
        const member = interaction.member;
        const role = interaction.guild.roles.cache.find(role => role.name === 'GPT blacklist');
        if (blacklist.hasOwnProperty(user.id)) {
            var now = Date.now();
            if (blacklist[user.id]["until"] > now) {
                // blacklist user for 30 more days (in milliseconds)
                blacklist[user.id]["until"] += 2592000000;
            }
            else {
                // blacklist user for 30 days (in milliseconds)
                blacklist[user.id]["since"] = now;
                blacklist[user.id]["until"] = now + 2592000000;
            }
        }
        else {
            var now = Date.now();
            blacklist[user.id] = {
                // blacklist user for 30 days (in milliseconds)
                "since": now,
                "until": now + 2592000000
            };
        }
        await member.roles.add(role);
        fs.writeFileSync('./data/blacklist.json', JSON.stringify(blacklist, null, 4)); // Write the changes to blacklist.json
        console.log(`blacklisted ${user.username}#${user.discriminator} (${user.id})`);
        await interaction.editReply('blacklisted user');
    }
};