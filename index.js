const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 👑 管理ロール名（ここ変更）
const ADMIN_ROLE_NAME = "Admin";

// 📂 データ読み込み
let market = {};
const filePath = "./data.json";

if (fs.existsSync(filePath)) {
  market = JSON.parse(fs.readFileSync(filePath));
}

// 💾 保存
function saveData() {
  fs.writeFileSync(filePath, JSON.stringify(market, null, 2));
}

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  // 📊 価格取得
  if (message.content.startsWith("!price")) {
    const name = message.content.replace("!price", "").trim();

    if (!name) return message.reply("Usage: !price <item>");

    const value = market[name];

    if (value === undefined) {
      return message.reply("Not registered");
    }

    return message.reply(`${name} = ${value}`);
  }

  // ➕ 追加（ロール制限）
  if (message.content.startsWith("!add")) {
    if (!message.member.roles.cache.some(r => r.name === ADMIN_ROLE_NAME)) {
      return message.reply("No permission");
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
