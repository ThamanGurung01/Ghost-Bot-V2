const coinCommand=(message)=>{
    const coin = Math.random() > 0.5 ? "Heads" : "Tails";
    // message.channel.send(`The coin landed on ${coin}!`);
    message.channel.send({
        embeds: [{
            title: `Coin landed on ${coin}`,
            color: 0xFFD700,
        }]
    });
}
export default coinCommand;