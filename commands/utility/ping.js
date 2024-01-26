const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription("Gives the bot's latency."),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pong...', fetchReply: true });
		interaction.editReply(`Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);	},
};