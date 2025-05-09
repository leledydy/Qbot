import { Client, GatewayIntentBits } from 'discord.js';
import axios from 'axios';
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

// Anthropic API setup
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Function to call Anthropic API
const callAnthropicAPI = async (messageContent) => {
  try {
    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: "claude-3-haiku-20240307", // replace with your model
        max_tokens: 1000,
        messages: [
          { role: "user", content: messageContent }
        ]
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data.content[0].text;
  } catch (error) {
    console.error('🚨 Error calling Anthropic API:', error.response?.data || error.message);
    return "❌ I couldn't get a response from Anthropic.";
  }
};

// Bot ready
client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// Message listener
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.name !== '❓︱𝗮𝘀𝗸-𝘂𝘀-𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻') return;

  try {
    const reply = await callAnthropicAPI(message.content);
    message.reply(reply);
  } catch (err) {
    console.error('❌ Error replying:', err);
    message.reply("Sorry, I couldn't process that right now.");
  }
});

// Now it's safe to log in
client.login(process.env.BOT_TOKEN);
