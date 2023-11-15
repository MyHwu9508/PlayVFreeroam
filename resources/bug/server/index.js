// import alt from 'alt-server';

// alt.on('playerConnect', player => {
//   alt.log(`${player.name} connected to the server.`);

//   alt.setInterval(() => {
//     const model = Math.random() > 0.5 ? alt.hash('mp_m_freemode_01') : alt.hash('mp_f_freemode_01');
//     if (!player?.valid) return;
//     player.model = model;
//     player.streamed = false;
//     player.model = model;
//     alt.setTimeout(() => {
//       player.spawn(0, 0, 72, 0);
//       player.streamed = true;
//     }, 2000);
//   }, 10000);
// });
