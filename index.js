require('dotenv').config(); // Load .env file

const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');
const { obfuscate } = require('js-confuser');
// Bot token from .env
const bot = new Telegraf(process.env.BOT_TOKEN);

// /start command
bot.start((ctx) => {
  ctx.reply('👋 Welcome to JamesTech Bot!\nType /help to see all commands.');
});
bot.command('encrypt', async (ctx) => {
  const reply = (text) => ctx.reply(text);

  // Check if a document is attached
  if (!ctx.message.document || !ctx.message.document.file_name.endsWith('.js')) {
    return reply('❌ Please upload a .js file with this command.');
  }

  try {
    // Download the document
    const fileId = ctx.message.document.file_id;
    const fileLink = await ctx.telegram.getFileLink(fileId);
    
    const res = await fetch(fileLink.href);
    const jsCode = await res.text();

    // Inform user
    await reply('🔐 Encrypting your JavaScript file...');

    // Obfuscate the code
    const obfuscated = await obfuscate(jsCode, {
      target: "node",
      preset: "high",
      compact: true,
      minify: true,
      flatten: true,
      identifierGenerator: function () {
        const originalString = "素JAMES晴TECH晴" + "素JAMES晴TECH晴";
        const removeUnwantedChars = (input) => input.replace(/[^a-zA-Z素GIDDY晴TENNOR晴]/g, "");
        const randomString = (length) => {
          let result = "";
          const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
          for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
          }
          return result;
        };
        return removeUnwantedChars(originalString) + randomString(2);
      },
      renameVariables: true,
      renameGlobals: true,
      stringEncoding: true,
      stringSplitting: 0.0,
      stringConcealing: true,
      stringCompression: true,
      duplicateLiteralsRemoval: 1.0,
      shuffle: { hash: 0.0, true: 0.0 },
      stack: true,
      controlFlowFlattening: 1.0,
      opaquePredicates: 0.9,
      deadCode: 0.0,
      dispatcher: true,
      rgf: false,
      calculator: true,
      hexadecimalNumbers: true,
      movedDeclarations: true,
      objectExtraction: true,
      globalConcealing: true,
    });

    // Save to a temp file
    const filePath = path.join(__dirname, 'james.js');
    fs.writeFileSync(filePath, obfuscated);

    // Send the file back
    await ctx.replyWithDocument({ source: filePath, filename: 'encrypted.js' }, {
      caption: `✅ Successfully Encrypted\n• Type: Hard Obfuscation\n• From: JamesTech`,
    });

    // Clean up
    fs.unlinkSync(filePath);

  } catch (error) {
    console.error(error);
    reply('❌ Encryption failed. Please try again.');
  }
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