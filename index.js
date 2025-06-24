require('dotenv').config(); // Load .env file

const { Telegraf } = require('telegraf');

// Bot token from .env
const bot = new Telegraf(process.env.BOT_TOKEN);

// /start command
bot.start((ctx) => {
  ctx.reply('👋 Welcome to JamesTech Bot!\nType /help to see all commands.');
});

// /help command
bot.command('help', (ctx) => {
  ctx.reply('Available Commands:\n/start - Welcome Message\n/help - Show this help\n/about - About this bot');
});

// /about command
bot.command('about', (ctx) => {
  ctx.reply('🤖 JamesTech Bot is built with Node.js and hosted on Render.com');
});

// Launch bot with long polling
bot.launch();
console.log('✅ Bot is running...');

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));