import { Message } from 'discord.js';
import { iEvent } from 'flavus';
import { Core } from '../../struct/Core';

const MessageEvent: iEvent = {
  name: 'messageCreate',
  async execute(client: Core, message: Message) {
    if (!message.content || !message.guild || message.author.bot) return;
    if (!message.content.startsWith(client.config.prefix)) return;
    const args = message.content
      .slice(client.config.prefix.length)
      .split(' ')
      .filter(Boolean);
    const commandArg = args.shift()?.toLowerCase();
    if (!commandArg) return;
    const command =
      client.commands.get(commandArg) || client.aliases.get(commandArg);
    if (!command) return;

    await command.execute({
      client,
      message,
      args
    });
  }
};

export default MessageEvent;
