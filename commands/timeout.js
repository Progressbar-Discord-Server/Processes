const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription(`Timeout a member for up to 28 days.`)
		.addUserOption(o => o
			.setName("user")
			.setDescription("The user to timeout")
			.setRequired(true))
		.addStringOption(o => o
			.setName('unit')
			.setDescription('In which unit is the duration?')
			.setRequired(true)
			.addChoices({ name: 'seconds', value: 'seconds' }, { name: 'minutes', value: 'minutes' }, { name: 'hours', value: 'hours' }, { name: 'days', value: 'days' }))
		.addIntegerOption(o => o
			.setName("duration")
			.setDescription('How long should this user be timed out for? (max 28 days)')
			.setRequired(true))
		.addStringOption(o => o
			.setName("reason")
			.setDescription('Why should this user be timed out?')),
	async execute(interaction) {
		const member = interaction.options.getMember('user')
		const RealLen = interaction.options.getInteger('duration')
		let length = interaction.options.getInteger('duration')
		const unit = interaction.options.getString('unit')
		let reason = interaction.options.getString('reason')

		if (!reason) reason = "No reason provided"

		if (unit == "seconds") {
			length = Math.floor(length * 1000)
		} else if (unit == "minutes") {
			length = Math.floor(length * 60 * 1000)
		} else if (unit == "hours") {
			length = Math.floor(length * 60 * 60 * 1000)
		} else if (unit == "days") {
			length = Math.floor(length * 24 * 60 * 60 * 1000)
		}

		if (length > 2.419e+9) {
			await interaction.reply(`**I cannot timeout ${user.tag} for that long! You provided a time longer than 28 days!**`)
		}
		else {
			member.timeout(length, reason + " | Timeout by " + interaction.member.user.tag)
			.then(async () => {await interaction.reply(`Timedout ${member} for **${RealLen} ${unit}** for **"${reason}".**`)})
			.catch(async error => {
				console.log(error)
				await interaction.reply({content: `**I cannot timeout ${member.tag}! They have staff permissions!**`, ephemeral: true})
			})
		}
	},
};
