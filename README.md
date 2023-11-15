# PlayV.mp Freeroam Server

This resource is made for the **[alt:V](https://altv.mp/)** release branch (V15.57).
Special thanks to our users, team members and co-developer **[tomatenbaumful](https://github.com/tomatenbaumful)** :heart:

**Feel free to help us with the project by implementing your own fixes or new features and create a pull request :)**

## Features

- Ready to start Freeroam Server
- Feature rich menu & framework
- Synced NPC Traffic with a lot tweaking options
- Vehicle spawner, tuning, handling editor + database storing
- Menyoo Import/ Export
- Full fledged character editor + database storing
- Noclip & Freecam
- Lobby system to create own lobbys + presets
- Synced weather and time
- [Speedometers](https://github.com/MyHwu9508/altv-os-speedometer-collection)
- IPL & Interior Browser
- Blips for players
- Voice
- Discord Integration (optional for users)
- And more...

## Installation

1. Clone this repo to your local pc

2. Database setup
   For a smooth experience we suggest installing and using [PostgreSQL](https://www.postgresql.org/download/) for the database. Since we used typeorm you can also use any other database tool, that works with typeorm. To change the database type change the 'type' value in src/playv/server/systems/db/TypeORM.ts .

3. alt:V setup
   Download the release server version of alt:V and paste it into the root folder of the cloned git repo

4. Node Modules
   Make sure you have the latest [Node.js](https://nodejs.org/en) version installed on your machine, then
   navigate into the cloned repo and run `npm i`. Also navigate to the CEF folder and also run `npm i`.

5. Server Config
   Open the server.toml file and edit the database config matching your database credentials. If you consider using the server public make sure you create a Discord Bot and add the matching token to the server.toml

## Starting the server

Open a terminal and run in the root folder of the project the command `npm run dev`. Then open another terminal and run `npm run dev:ui` to start the UI.

Start your alt:V client on release branch and direct connect to localhost:7788

After your first connect to the server change your authLevel to any higher then 0 to access the admin menu on the server.

## Screenshots

![Spawn area](https://i.imgur.com/Wi6l4aS.jpg) ![Main Menu](https://i.imgur.com/YSK0sqQ.png)
![Our spawn protectors Kaniggel and Tomatenbaum](https://i.imgur.com/6PiYD1M.jpg)

## Known Errors

- High bandwidth usage on player disconnect (maybe caused by our blip sync)
- Traffic vehicles migration is buggy and vehicles are randomly deleted
- Laggy vehicle spawner menu page
- Lobby presets need a rework

## Useful information

- The src/playv/shared/conf/ConVars.ts file contains a lot of important configurations. Change them to your liking.
- Feel free to use any part of the code in your project, but respect the licensing of the codebase.
- To add modded vehicles load the resources and add the vehicle spawn names to the database table modded_vehicles (needs a server restart).
- When building the resource for production make sure to use debug = false in the server.toml!
- Never ever use the server in production without your own auth method for the users! We implemented CloudAuth and you need a valid token & benefit from alt:V to use it!

## Sources & Used Packages

**UI**

- [Svelte](https://svelte.dev/)
- [Skeleton](https://www.skeleton.dev/)
- [IBM Carbon Icons](https://icones.js.org/collection/carbon)
- [Tailwindcss](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Howler.js](https://howlerjs.com/)
- [Google Fonts](https://fonts.google.com/)
- And more...

**Server & Client**

- [alt:V](https://altv.mp/#/)
- [Various snippets from the alt:V community](https://discord.com/channels/371265202378899476/1019653489309274222)
- [GTA 5 Data Dumps by DurtyFree](https://github.com/DurtyFree/gta-v-data-dumps)
- [alt:V Typescript Boilerplate by Stuyk](https://github.com/Stuyk/altv-typescript)
- [GTA5 Weapon Data by root-cause](https://gist.github.com/root-cause/3f29d38179b12245a003fb4fff615335)
- [altv-synced-nitro by Rezondes (partially)](https://github.com/Cops-and-Crimes/altv-synced-nitro)
- [altv-os-character-editor by Stuyk (partially)](https://github.com/Stuyk/altv-os-character-editor)
- [esbuild](https://esbuild.github.io/)
- [chalk](https://www.npmjs.com/package/chalk)
- [colord](https://www.npmjs.com/package/colord)
- [cors](https://www.npmjs.com/package/cors)
- [express](https://www.npmjs.com/package/express)
- [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser)
- [fkill](https://www.npmjs.com/package/fkill)
- [i18next](https://www.npmjs.com/package/i18next)
- [lodash](https://www.npmjs.com/package/lodash)
- [multer](https://www.npmjs.com/package/multer)
- [observable-slim](https://www.npmjs.com/package/observable-slim)
- [pg](https://www.npmjs.com/package/pg)
- [quaternion](https://www.npmjs.com/package/quaternion)
- [readline](https://www.npmjs.com/package/readline)
- [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
- [sjcl](https://www.npmjs.com/package/sjcl)
- [socket.io](https://www.npmjs.com/package/socket.io)
- [toml](https://www.npmjs.com/package/toml)
- [ts-node](https://www.npmjs.com/package/ts-node)
- [typeorm](https://www.npmjs.com/package/typeorm)
- [unique-username-generator](https://www.npmjs.com/package/unique-username-generator)
- [uuidjs](https://www.npmjs.com/package/uuidjs)
- [zod](https://www.npmjs.com/package/zod)
- [openai](https://www.npmjs.com/package/openai)
- [swc](https://www.npmjs.com/package/@swc/core)
- [altv-pkg](https://www.npmjs.com/package/altv-pkg)
- And more...

## Help

**Please note, that we don't provide support for the database connection, or the Discord Authentication**
In case you have any questions or concerns regarding this, feel free to contact us on Discord.

**Kaniggel**
**Tomatenbaum**

Alternatively you can join our Discord and create a ticket: https://playv.mp/discord

## License

This project is written by **[Kaniggel](https://github.com/MyHwu9508)** and **[tomatenbaumful](https://github.com/tomatenbaumful)** and the project source files are published under **MIT License**
[Google Fonts](https://fonts.google.com/) are being used within this project. For commerical use, please check for licensing!

Any trademarks used belong to their respective owners. This project is not affiliated with or endorsed by Take-Two Interactive Software.
