console.log("☑️ㅤIniciando bot...");
import {join, dirname} from "path";
import {fileURLToPath} from "url";
import {setupMaster, fork} from "cluster";
import cfonts from "cfonts";
import {createInterface} from "readline";
import yargs from "yargs";
import express from "express";
const __dirname = dirname(fileURLToPath(import.meta.url));
const {say} = cfonts;
const rl = createInterface(process.stdin, process.stdout);
const app = express();
const port = 3000
const rl = createInterface(process.stdin, process.stdout)

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

say("THE DORRAT-BOT-MD", {
  font: "tiny",
  align: "center",
  colors: ["#ff8000"],
});
say(`CREADO POR DIEGO-OFC`, {
  font: "console",
  align: "center",
  colors: ["red"],
});

var isRunning = false;
/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
  if (isRunning) return;
  isRunning = true;
  let args = [join(__dirname, file), ...process.argv.slice(2)];

  setupMaster({
    exec: args[0],
    args: args.slice(1),
  });
  let p = fork();
  p.on("message", (data) => {
    console.log("[RECEIVED]", data);
    switch (data) {
      case "reset":
        p.process.kill();
        isRunning = false;
        start.apply(this, arguments);
        break;
      case "uptime":
        p.send(process.uptime());
        break;
    }
  });
  p.on("exit", (_, code) => {
    isRunning = false;
    console.error("⚠️ㅤOcurrio un error Por favor arreglarlo:", code);

    p.process.kill();
    isRunning = false;
    start.apply(this, arguments);

    if (process.env.pm_id) {
      process.exit(1);
    } else {
      process.send("reset");
    }
  });
  let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
  if (!opts["test"])
    if (!rl.listenerCount())
      rl.on("line", (line) => {
        p.emit("message", line.trim());
      });
}
start("main.js");
