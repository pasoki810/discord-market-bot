const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 完全登録制（最初は空）
const market = {};

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  // 📊 GET PRICE
  if (message.content.startsWith("!price")) {
    const name = message.content.replace("!price", "").trim();

    if (!name) {
      return message.reply("Usage: !price <item name>");
    }

    const value = market[name];

    if (value === undefined) {
      return message.reply("Not registered");
    }

    return message.reply(`${name} = ${value}`);
  }

  // ➕ ADD ITEM
  if (message.content.startsWith("!add")) {
    const args = message.content.replace("!add", "").trim().split(" ");

    if (args.length < 2) {
      return message.reply("Usage: !add <name> <value>");
    }

    const name = args[0];
    const value = parseFloat(args[1]);

    if (isNaN(value)) {
      return message.reply("Value must be a number");
    }

    market[name] = value;

    return message.reply(`Added: ${name} = ${value}`);
  }
});

client.login(process.env.TOKEN);
