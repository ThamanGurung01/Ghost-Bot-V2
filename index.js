import { Client, GatewayIntentBits } from 'discord.js';
import { scheduleJob } from 'node-schedule';
import { configDotenv } from 'dotenv';
import fetch from 'node-fetch';
import fs,{readFileSync } from "fs";
configDotenv();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const MyChannelId = process.env.CHANNEL_ID;
const special_user=process.env.SPECIAL_USER;
let channel;
const SecretName = "Ghost";
const SecretImageUrl = "./assets/discord/ghost.jpg";
const SecretAvatar = fs.readFileSync(SecretImageUrl);

const oldName = "Test-2 Bot";
const oldImageUrl = "./assets/discord/discord-logo.png";
const oldAvatar = fs.readFileSync(oldImageUrl);

let isInSecretMode = false;

const sendMessageChannel=async(channel,message)=>{
  await channel.send(message);
}

const SecretMode = async () => {
  if (!isInSecretMode) {
    try {
      await client.user.setUsername(SecretName);
      await client.user.setAvatar(SecretAvatar);
      isInSecretMode = true;
      console.log('Switched to ghost mode.');
    } catch (error) {
      console.error('Error switching to ghost mode:', error);
    }
  }
};

const PlainMode = async () => {
  if (isInSecretMode) {
    try {
      await client.user.setUsername(oldName);
      await client.user.setAvatar(oldAvatar);
      isInSecretMode = false;
      console.log('Reverted to plain mode.');
    } catch (error) {
      console.error('Error reverting to plain mode:', error);
    }
  }
};

const UserPing = async () => {
  try {
    if (!isInSecretMode) {
      await SecretMode();
    }
    const data = JSON.parse(readFileSync(new URL("./users.json", import.meta.url), "utf-8"));
    if(!data.users)
      return;
    UsersID=data.users;
    let shuffledUsers = UsersID.sort(() => Math.random() - 0.5);
    let randomId = shuffledUsers[0];

    if (channel) {
      const botMessage = sendMessageChannel(channel,`Hello <@${randomId}>`);
      setTimeout(async () => {
        await botMessage.delete();
        console.log(`Message sent to <@${randomId}> and deleted.`);
      }, 30000);
      setTimeout(PlainMode, 120000);
    }
  } catch (error) {
    console.error('Error in UserPing:', error);
  }
};

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  channel = await client.channels.fetch(MyChannelId);
  scheduleJob("57 24 * * *", async () => {
    await SecretMode(); 
  });
  scheduleJob("15 14 * * *", UserPing);
});

// Normal functions
const sadWords = ["sad", "depressed", "unhappy", "angry"];
const encouragements = [
  "Cheer up!",
  "Hang in there",
  "You are a great person/bot",
];

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => res.json())
    .then(data => data[0]["q"] + " -" + data[0]["a"]);
}

client.on("messageCreate", message => {
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith("hi")) {
    message.reply({ content: "Hi 😊😊" });
  } else if (message.content.toLowerCase().startsWith("hello")) {
    message.reply({ content: "Hello 😊😊" });
  } else if (message.content.toLowerCase().startsWith("binod is")) {
    message.reply({ content: "Noob" });
  } else if(message.content.toLowerCase().startsWith("binod")){
    if(channel){
      sendMessageChannel(channel,"noob");
    }else{
      console.log("Error in channel send message channel");
    }
  } else if (message.content.toLowerCase().startsWith("who is noob")){
    if(channel){
      if(special_user){
      sendMessageChannel(channel,`<@${special_user}> is noob`);
      }else{
      sendMessageChannel(channel,"IDK")
      }
    }else{
      console.log("Error in channel send message channel");
    }
  } else if (message.content === "$inspire") {
    getQuote().then(quote => message.reply(quote));
  } else if (sadWords.some(word => message.content.includes(word))) {
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    message.reply(encouragement);
  }
});

client.login(process.env.BOT_TOKEN);