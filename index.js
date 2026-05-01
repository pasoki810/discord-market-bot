const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🔐 管理者ID（自分のDiscord ID入れる）
const ADMIN_ID = "YOUR_DISCORD_ID";

// 📂 データ読み込み
let market = {};
const filePath = "./data.json";

if (fs.existsSync(filePath)) {
  market = JSON.parse(fs.readFileSync(filePath));
}

// 💾 保存関数
function saveData() {
  fs.writeFileSync(filePath, JSON.stringify(market, null, 2));
}

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  // 📊 価格確認
  if (message.content.startsWith("!price")) {
    const name = message.content.replace("!price", "").trim();

    if (!name) return message.reply("Usage: !price <item>");

    const value = market[name];

    if (value === undefined) {
      return message.reply("Not registered");
    }

    return message.reply(`${name} = ${value}`);
  }

  // ➕ 追加（管理者のみ）
  if (message.content.startsWith("!add")) {
    if (message.author.id !== ADMIN_ID) {
      return message.reply("You are not admin");
    }

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
    saveData();

    return message.reply(`Added: ${name} = ${value}`);
  }
});

client.login(process.env.TOKEN);
