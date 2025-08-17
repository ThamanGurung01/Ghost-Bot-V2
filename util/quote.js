import fetch from 'node-fetch';
export const getQuote=async()=> {
  return fetch("https://zenquotes.io/api/random")
    .then(res => res.json())
    .then(data => data[0]["q"] + " -" + data[0]["a"]);
}