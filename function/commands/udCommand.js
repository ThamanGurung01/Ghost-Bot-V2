import axios from "axios";
const udCommand= async (message, args) => {
      const term = args.join(' ');
      if (!term) return message.reply('Please provide a word.');

      const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`);
      const list = response.data.list;
      if (!list.length) return message.reply('No definitions found.');

      const top = list[0];
      message.channel.send({
        embeds: [{
          title: top.word,
          color: 0x6A0DAD,
          description: top.definition.length > 200 ? top.definition.slice(0, 200) + '...' : top.definition,
          fields: [
            { name: 'Example', value: top.example || 'N/A' },
          ],
          url: top.permalink
        }]
      });
}
export default udCommand;