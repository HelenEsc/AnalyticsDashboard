import { spawn } from "node:child_process";

function runDev(folder) {
  const cwd = new URL(`../${folder}/`, import.meta.url);

  // Node 24 on Windows can reject spawning npm.cmd directly with EINVAL.
  // Running npm through cmd.exe is the supported Windows execution path.
  if (process.platform === "win32") {
    const commandPrompt = process.env.ComSpec || "cmd.exe";
    return spawn(commandPrompt, ["/d", "/s", "/c", "npm run dev"], {
      cwd,
      stdio: "inherit",
    });
  }

  return spawn("npm", ["run", "dev"], { cwd, stdio: "inherit" });
}

const processes = [
  runDev("backend"),
  runDev("frontend"),
];

let stopping = false;
function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of processes) child.kill("SIGTERM");
  setTimeout(() => process.exit(exitCode), 250);
}

for (const child of processes) {
  child.on("error", error => {
    console.error(`Unable to start a development process: ${error.message}`);
    stop(1);
  });
  child.on("exit", code => {
    if (!stopping && code !== 0) stop(code ?? 1);
  });
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
