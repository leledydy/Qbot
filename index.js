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

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// Listen to messages and respond in specific channel
client.on('messageCreate', async (message) => {
  // Avoid bot responding to itself or messages in other channels
  if (message.author.bot) return;
  if (message.channel.name !== '❓︱𝗮𝘀𝗸-𝘂𝘀-𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻') return;

  try {
    // Send the message content to OpenAI API for response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Use GPT-4 model
      messages: [{ role: 'user', content: message.content }]
    });

    // Send the AI-generated response
    const reply = completion.choices[0].message.content;
    message.reply(reply);
  } catch (err) {
    console.error('❌ Error from OpenAI:', err);
    message.reply("Sorry, I couldn't process that right now.");
  }
});

// Log in with your Discord bot token
client.login(process.env.BOT_TOKEN);
