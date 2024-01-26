const {SlashCommandBuilder} = require('discord.js');
const fs = require('fs');

module.exports = { 
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Whitelist a user from ChatGPT.')
        .addUserOption(option => option.setName('user').setDescription('The user to whitelist.').setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        await interaction.reply('Whitelisting user...');
        var whitelist = require('../../data/whitelist.json');
        const user = interaction.user;
        const member = interaction.member;
        const role = interaction.guild.roles.cache.find(role => role.name === 'GPT Whitelist');
        if (whitelist.hasOwnProperty(user.id)) {
            var now = Date.now();
            if (whitelist[user.id]["until"] > now) {
                // Whitelist user for 30 more days (in milliseconds)
                whitelist[user.id]["until"] += 2592000000;
            }
            else {
                // Whitelist user for 30 days (in milliseconds)
                whitelist[user.id]["since"] = now;
                whitelist[user.id]["until"] = now + 2592000000;
            }
        }
        else {
            var now = Date.now();
            whitelist[user.id] = {
                // Whitelist user for 30 days (in milliseconds)
                "since": now,
                "until": now + 2592000000
            };
        }
        await member.roles.add(role);
        fs.writeFileSync('./data/whitelist.json', JSON.stringify(whitelist, null, 4)); // Write the changes to whitelist.json
        console.log(`Whitelisted ${user.username}#${user.discriminator} (${user.id})`);
        await interaction.editReply('Whitelisted user');
    }
};