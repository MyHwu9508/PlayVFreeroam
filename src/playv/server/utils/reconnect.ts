import alt from 'alt-server';
import fs from 'fs';

const RETRY_DELAY = 2500;
const DEBUG_PORT = 9223;
const FILE_NAME = 'ipc.txt';

const enum Status {
  Loading = 'LOADING',
  MainMenu = 'MAIN_MENU',
  DownloadingFiles = 'DOWNLOADING_FILES',
  Connecting = 'CONNECTING',
  InGame = 'IN_GAME',
  Disconnecting = 'DISCONNECTING',
  Error = 'ERROR',
}

function onChange() {
  const content = fs.readFileSync(FILE_NAME, { encoding: 'utf-8' });
  const contents = content.split('\n');
  const lastLine = contents[contents.length - 1].replace(/\n/g, '');

  switch (lastLine) {
    case 'kick-all':
      alt.log(`Invoking IPC Event 'kick-all'`);
      alt.Player.all.forEach(player => {
        player.kick('Restarting Server');
      });
      break;
  }
}

async function getLocalClientStatus(): Promise<Status | null> {
  try {
    const response = await fetch(`http://127.0.0.1:${DEBUG_PORT}/status`);
    return response.text() as unknown as Status;
  } catch (error) {
    return null;
  }
}

async function connectLocalClient(): Promise<void> {
  const status = await getLocalClientStatus();
  if (status === null) {
    return;
  }

  if (status !== Status.MainMenu && status !== Status.InGame) {
    setTimeout(() => connectLocalClient(), RETRY_DELAY);
  }

  try {
    await fetch(`http://127.0.0.1:${DEBUG_PORT}/reconnect`, {
      method: 'POST',
      body: 'serverPassword', // only needed when a password is set in the server.toml
    });
  } catch (error) {
    console.log(error);
  }
}

export function startReconnectWatcher() {
  if (alt.debug) {
    if (fs.existsSync(FILE_NAME)) {
      fs.rmSync(FILE_NAME);
    }

    fs.writeFileSync(FILE_NAME, '');
    fs.watch(FILE_NAME, onChange);
    connectLocalClient();
    alt.log(`Reconnect Watcher started.`);
  }
}
