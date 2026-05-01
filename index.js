const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🔽 最初は空（完全登録制）
const market = {};

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!相場")) {
    const name = message.content.replace("!相場", "").trim();

    if (!name) return message.reply("使い方：!相場 名前");

    const value = market[name];

    if (value === undefined) {
      return message.reply("未登録");
    }

    message.reply(`${name} = ${value}`);
  }
});

client.login(process.env.TOKEN);

