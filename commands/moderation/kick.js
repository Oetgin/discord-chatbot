const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Select a member and kick them.')
		.addUserOption(option => option.setName('target').setDescription('The member to kick').setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
		const member = interaction.options.getMember('target');
		
		await member.kick();
		
		var userInfo = require('../../data/user-info.json');
		userInfo[member.user.id]["kicks"] += 1;
		fs.writeFileSync('./data/user-info.json', JSON.stringify(userInfo, null, 4)); // Write the changes to user-info.json
		
		return interaction.reply(`You kicked: ${member.user.username}`);
	},
};