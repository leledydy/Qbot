import { Client, GatewayIntentBits } from 'discord.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
client.login(process.env.BOT_TOKEN);


// Initialize Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Anthropic API key (replace with your own)
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/claude/chat';

// Function to call Anthropic API
const callAnthropicAPI = async (messageContent) => {
  try {
    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        messages: [{ role: 'user', content: messageContent }],
      },
      {
        headers: {
          'Authorization': `Bearer ${ANTHROPIC_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    throw new Error('Failed to communicate with Anthropic API.');
  }
};

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// Listen to messages and respond in a specific channel
client.on('messageCreate', async (message) => {
  // Avoid bot responding to itself or messages in other channels
  if (message.author.bot) return;
  if (message.channel.name !== '❓︱𝗮𝘀𝗸-𝘂𝘀-𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻') return;

  try {
    // Get response from Anthropic API
    const reply = await callAnthropicAPI(message.content);
    message.reply(reply);
  } catch (err) {
    console.error('❌ Error:', err);
    message.reply("Sorry, I couldn't process that right now.");
  }
});

// Log in with your Discord bot token
client.login(process.env.BOT_TOKEN);
