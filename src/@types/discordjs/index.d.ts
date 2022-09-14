import type { Client } from 'discord.js';

declare module 'discord.js' {
  export interface Client {
    config: BotConfig;
  }
}
