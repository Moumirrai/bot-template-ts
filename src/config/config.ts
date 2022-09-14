import * as dotenv from 'dotenv';
import { ColorResolvable } from 'discord.js';
import { resolve } from 'path';
dotenv.config();

//TODO: no need for config folder - remove

export type BotConfig = {
  token: string;
  prefix: string;
  owner: string;
  mongodb_uri: string;
  embed: {
    colors: {
      default: ColorResolvable;
      error: ColorResolvable;
      success: ColorResolvable;
      warning: ColorResolvable;
    };
  };
  debugMode: boolean;
  ratelimit: boolean;
};

export const config: BotConfig = {
  token: process.env.TOKEN,
  prefix: process.env.PREFIX,
  owner: process.env.OWNER,
  mongodb_uri: process.env.MONGODB_SRV,
  embed: {
    colors: {
      default: '#ffcc00',
      error: '#ff0000',
      success: '#00ff00',
      warning: '#ffff00'
    },
  },
  debugMode: process.env.DEBUGMODE === 'true',
  ratelimit: process.env.RATELIMIT === 'true'
};
