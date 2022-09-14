import { config } from '../config/config';
import { Client, Intents, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import Logger from './Logger';
import { resolve } from 'path';
import type { iCommand } from 'flavus';
import { connect, ConnectOptions } from 'mongoose';
import Functions from './Functions';
import Embeds from './Embeds';
import Mongo from './Mongo';

export class Core extends Client {
  constructor() {
    super({
      partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
      ],
      presence: {
        status: 'dnd'
      }
    });

    this.config = config;
  }
  public logger = Logger;

  public aliases = new Collection<string, iCommand>();
  public commands = new Collection<string, iCommand>();
  public status = 1;
  public functions = Functions;
  public embeds = Embeds;
  public mongo = Mongo;
  public async main() {
    try {
      this.logger.info('Initializing...');
      await this.loadEvents();
      await this.loadCommands();
      await this.mongoDB();
      await this.login(this.config.token);
    } catch (error) {
      this.logger.error(error);
      this.destroy();
      process.exit(1);
    }
  }

  private async mongoDB(): Promise<void> {
    connect(this.config.mongodb_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false
    } as ConnectOptions)
      .then(() => {
        return this.logger.info('Connected to MongoDB');
      })
      .catch((err) => {
        return this.logger.error('MongoDB connection error: ' + err);
      });
  }

  private async loadCommands(): Promise<void> {
    const files = readdirSync(resolve(__dirname, '..', 'commands'));
    for (const file of files) {
      const command = (await import(resolve(__dirname, '..', 'commands', file)))
        .default;
      //check if command name is already in use
      if (this.commands.has(command.name)) {
        this.logger.warn(
          `Command with name ${command.name} already exists, skipping...`
        );
        continue;
      }
      this.commands.set(command.name, command);
      if (command.aliases.length > 0) {
        command.aliases.forEach((alias) => {
          this.aliases.set(alias, command);
        });
      }
    }
    this.logger.info(`${this.commands.size} commands loaded!`);
  }

  private async loadEvents(): Promise<void> {
    const files = readdirSync(resolve(__dirname, '..', 'events', 'client'));
    for (const file of files) {
      const event = (
        await import(resolve(__dirname, '..', 'events', 'client', file))
      ).default;
      this.on(event.name, (...args) => event.execute(this, ...args));
    }
    this.logger.info(`${files.length} events loaded!`);
  }
}
