export const sendMessageChannel=async(channel,message)=>{
  await channel.send(message);
}