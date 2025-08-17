import {getQuote} from "../util/quote.js";
import { sendMessageChannel } from '../util/sendMessage.js';
export const messageCreate= (message,channel,special_user)=> {
const sadWords = ["sad", "depressed", "unhappy", "angry"];
const encouragements = [
  "Cheer up!",
  "Hang in there",
  "You are a great person/bot",
];
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
}