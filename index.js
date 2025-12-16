require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { spawn } = require("child_process");

// caminhos (AJUSTE SE NECESSÁRIO)
const BEDROCK_DIR = "C:/ServidorBedrock";
const BEDROCK_EXE = "bedrock_server.exe";
const PLAYIT_EXE = "playit.exe";

let bedrockProcess = null;
let playitProcess = null;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`✅ Bot ligado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const cmd = message.content.toLowerCase();

  // 🔹 LIGAR SERVIDOR
  if (cmd === "!server on") {
    if (bedrockProcess) {
      return message.reply("⚠️ O servidor já está ONLINE.");
    }

    bedrockProcess = spawn(BEDROCK_EXE, [], {
      cwd: BEDROCK_DIR,
      stdio: "pipe"
    });

    playitProcess = spawn(PLAYIT_EXE, [], {
      cwd: BEDROCK_DIR,
      stdio: "pipe"
    });

    message.reply("✅ Servidor Bedrock + playit.gg iniciados!");
  }

  // 🔹 DESLIGAR SERVIDOR
  if (cmd === "!server off") {
    if (bedrockProcess) {
      bedrockProcess.stdin.write("stop\n");
      bedrockProcess.kill();
      bedrockProcess = null;
    }

    if (playitProcess) {
      playitProcess.kill();
      playitProcess = null;
    }

    message.reply("🛑 Servidor desligado com segurança.");
  }

  // 🔹 STATUS
  if (cmd === "!status") {
    const status = bedrockProcess ? "🟢 ONLINE" : "🔴 OFFLINE";
    message.reply(`Status do servidor: ${status}`);
  }
});

client.login(process.env.DISCORD_TOKEN);
