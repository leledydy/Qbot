const { Client, GatewayIntentBits } = require('discord.js');
const OpenAI = require('openai');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (message.channel.name !== 'ask-us-question') return;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message.content }]
    });

    const reply = completion.choices[0].message.content;
    message.reply(reply);
  } catch (err) {
    console.error('❌ Error from OpenAI:', err);
    message.reply("Sorry, I couldn't process that right now.");
  }
});

client.login(process.env.BOT_TOKEN);