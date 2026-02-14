import wikiCommand from "./commands/wikiCommand.js";
import udCommand from "./commands/udCommand.js";
import coinCommand from "./commands/coinCommand.js";
const Command=(message)=>{
    const prefix="!";
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if(command==="t.help"){
    message.channel.send({
    embeds: [{
    title: 'Available Commands',
    color: 0x1abc9c,
    description: 'Here are some commands you can use with the bot:',
    fields: [
      { name: '!wiki [search term]', value: 'Search Wikipedia for the given term.', inline: false },
      { name: '!ud [search term]', value: 'Search Urban Dictionary for the given term.', inline: false },
      { name: '!coin', value: 'Flip a coin and get heads or tails.', inline: false },
    ],
    footer: { text: 'Use these commands to explore and have fun!' }
    }]
    });
    }else if(command === "wiki"){
        wikiCommand(message, args);
    }else if (command === "ud"){
        udCommand(message, args);
    }else if (command==="coin"){
        coinCommand(message, args);
    }
}
export default Command;