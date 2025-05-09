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

// Listen to messages and respond in a specific channel
client.on('messageCreate', async (message) => {
  // Avoid bot responding to itself or messages in other channels
  if (message.author.bot) return;
  if (message.channel.name !== '❓︱𝗮𝘀𝗸-𝘂𝘀-𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻') return;

  try {
    // Try GPT-4, fallback to GPT-3.5 if GPT-4 is unavailable
    let model = 'gpt-4';
    try {
      // Send the message content to OpenAI API for GPT-4
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: message.content }]
      });

      // Send the AI-generated response
      const reply = completion.choices[0].message.content;
      message.reply(reply);
    } catch (err) {
      if (err.code === 'model_not_found') {
        console.log('GPT-4 not found, falling back to GPT-3.5');
        model = 'gpt-3.5-turbo';  // Fallback to GPT-3.5
        const fallbackCompletion = await openai.chat.completions.create({
          model: model,
          messages: [{ role: 'user', content: message.content }]
        });

        // Send the fallback AI-generated response
        const fallbackReply = fallbackCompletion.choices[0].message.content;
        message.reply(fallbackReply);
      } else {
        throw err;  // Rethrow if the error is not related to model availability
      }
    }
  } catch (err) {
    console.error('❌ Error from OpenAI:', err);
    message.reply("Sorry, I couldn't process that right now.");
  }
});

// Log in with your Discord bot token
client.login(process.env.BOT_TOKEN);
