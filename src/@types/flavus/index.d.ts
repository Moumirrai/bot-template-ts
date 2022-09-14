declare module 'flavus' {
  export interface CommandArgs {
    client: import('../../struct/Core').Core;
    message: import('discord.js').Message;
    args: string[];
  }
  export interface iCommand {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    visible: boolean;
    execute: (commandArgs: CommandArgs) => Promise<unknown>;
  }
  export interface iEvent {
    name: string;
    execute: (
      client: import('../../struct/Core').Core,
      ...args: any[]
    ) => Promise<unknown>;
  }

}
