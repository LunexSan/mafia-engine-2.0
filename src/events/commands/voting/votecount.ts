import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ServerType, newSlashCommand } from '@structures/interactions/SlashCommand';
import { calculateVoteCount, formatVoteCount } from '../../../util/votecount';
import { getVoteCounter } from '@models/votecounter';

const data = new SlashCommandBuilder().setName('votecount').setDescription('View the vote count');
data.addBooleanOption((opt) => opt.setName('hidden').setDescription('To make this for only you to see').setRequired(false));

export default newSlashCommand({
	data,
	serverType: ServerType.MAIN,
	execute: async (i: ChatInputCommandInteraction) => {
		if (!i.guild) return;
		const hidden = i.options.getBoolean('hidden', false) ?? false;

		try {
			const voteCounter = await getVoteCounter({ channelId: i.channelId });
			if (!voteCounter) return i.reply({ content: 'This is not a vote channel', ephemeral: true });

			const calculated = calculateVoteCount(voteCounter);
			const format = formatVoteCount(calculated);

			return i.reply({ content: format, ephemeral: hidden });
		} catch (err) {
			console.log(err);
			return i.reply({ content: 'An error occured while accessing the vote count', ephemeral: true });
		}
	},
});