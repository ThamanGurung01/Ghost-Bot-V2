import { Client, GatewayIntentBits } from 'discord.js';
import cron from "node-cron";
import { configDotenv } from 'dotenv';
import fs,{readFileSync } from "fs";
import { messageCreate } from './function/messageCreate.js';
import { sendMessageChannel } from './util/sendMessage.js';

configDotenv();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const MyChannelId = process.env.CHANNEL_ID;
const special_user = process.env.SPECIAL_USER;
let channel;
const SecretName = "Ghost";
const SecretImageUrl = "./assets/discord/ghost.jpg";
const SecretAvatar = fs.readFileSync(SecretImageUrl);

const oldName = "Test-2 Bot";
const oldImageUrl = "./assets/discord/discord-logo.png";
const oldAvatar = fs.readFileSync(oldImageUrl);

let isInSecretMode = false;

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
  cron.schedule('55 23 * * *', async () => {
    await SecretMode(); 
  },{
    timezone: "Asia/Kathmandu"
  });
  cron.schedule("0 0 * * *", UserPing,{
    timezone: "Asia/Kathmandu"
  });
});

client.on("messageCreate", message=>messageCreate(message,channel,special_user));

client.login(process.env.BOT_TOKEN);