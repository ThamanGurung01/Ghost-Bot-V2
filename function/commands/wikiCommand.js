import axios from "axios";

const wikiCommand= async (message, args) => {
const query = args.join(' ');
  if (!query) return message.reply('Please provide a topic.');

  try {
    const searchRes = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        srlimit: 1
      },
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" }
    });

    if (!searchRes.data.query.search.length) return message.reply('No results found.');

    const topResult = searchRes.data.query.search[0].title;
    const summaryRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topResult)}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" }
    });

    const data = summaryRes.data;
    message.channel.send({
      embeds: [{
        title: `About ${data.title}`,
        color: 0x3366CC,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
        description: data.extract.length > 500 ? data.extract.slice(0, 500) + '...' : data.extract,
        image: data.thumbnail ? { url: data.thumbnail.source } : null
      }]
    });
  } catch (err) {
    console.error(err);
    message.reply('Could not fetch information.');
  }
}
export default wikiCommand;