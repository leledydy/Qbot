import { Client, GatewayIntentBits } from 'discord.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Function to delay API requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// Listen to messages and respond in a specific channel
client.on('messageCreate', async (message) => {
  // Avoid bot responding to itself or messages in other channels
  if (message.author.bot) return;
  if (message.channel.name !== '❓︱𝗮𝘀𝗸-𝘂𝘀-𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻') return;

  try {
    let model = 'gpt-3.5-turbo';  // Use GPT-3.5 as fallback for now

    // Implementing Rate Limiting
    await delay(1000);  // Wait for 1 second before making the API request (adjust as needed)

    // Try sending the request
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: message.content }]
    });

    const reply = completion.choices[0].message.content;
    message.reply(reply);

  } catch (err) {
    if (err.code === 'insufficient_quota') {
      console.error('❌ Insufficient quota error, please check your OpenAI account usage.');
      message.reply("Sorry, I can't process your request right now due to insufficient quota.");
    } else {
      console.error('❌ Error from OpenAI:', err);
      message.reply("Sorry, I couldn't process that right now.");
    }
  }
});

// Log in with your Discord bot token
client.login(process.env.BOT_TOKEN);
