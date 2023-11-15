import fs from 'fs-extra';
import * as glob from 'glob';
import path from 'path';
import swc from '@swc/core';
import { normalizeFilePath } from './shared.js';
import esbuild from 'esbuild';
import { v4 as uuidv4 } from 'uuid';
import toml from 'toml';

const serverToml = fs.readFileSync('./server.toml', 'utf8');
const serverTomlParsed = toml.parse(serverToml);
const isInDebugMode = serverTomlParsed.debug;

const filesToRandomize = [];

const SWC_CONFIG = {
  jsc: {
    parser: {
      syntax: 'typescript',
      dynamicImport: true,
      decorators: true,
    },
    transform: {
      legacyDecorator: true,
      decoratorMetadata: true,
    },
    experimental: {
      keepImportAssertions: true,
    },
    target: 'es2020',
  },
  sourceMaps: false,
};

const ESBUILD_CONFIG = {
  entryPoints: ['./src/playv/client/index.ts'],
  outfile: './resources/playv/client/index.js',
  bundle: true,
  minify: !isInDebugMode,
  format: 'esm',
  external: ['alt-client', 'alt-shared', 'natives', '@assets'],
};
const excludedPaths = ['client/html']; // an array of excluded filepaths
const corePath = 'resources/playv';

function deleteFilesRecursively(dirPath) {
  let deleteFolder = true;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const fileStat = fs.lstatSync(filePath);

    if (fileStat.isDirectory()) {
      const excludedPathsContains = excludedPaths.some(excludedPath => {
        if (filePath === path.join(corePath, excludedPath)) {
          return true;
        }
      });
      if (!excludedPathsContains) {
        const res = deleteFilesRecursively(filePath);
        deleteFolder = deleteFolder && res;
      } else {
        console.log(`Skipping deletion for Folder: ${filePath}`);
        deleteFolder = false;
      }
    } else {
      fs.rmSync(filePath);
    }
  }
  if (deleteFolder) {
    fs.rmdirSync(dirPath);
  }
  return deleteFolder;
}

const deleteStart = Date.now();
const serverFiles = glob.sync('./src/playv/server/**/*.ts');
const sharedFiles = glob.sync('./src/playv/shared/**/*.ts');
const filesToCompile = [...serverFiles, ...sharedFiles];

//randomize events, metas etc
filesToRandomize.forEach(fPath => {
  randomizeSharedContent(fPath);
});

if (fs.existsSync(corePath)) {
  deleteFilesRecursively(corePath);
}
const deleteFinish = Date.now() - deleteStart;

const serverCompileTime = Date.now();

let compileCount = 0;
for (let i = 0; i < filesToCompile.length; i++) {
  const filePath = normalizeFilePath(filesToCompile[i]);
  const finalPath = filePath.replace('src/', 'resources/').replace('.ts', '.js');
  const compiled = swc.transformFileSync(filePath, SWC_CONFIG);
  fs.outputFileSync(finalPath, compiled.code, { encoding: 'utf-8' });
  compileCount += 1;
}

const serverCompileFinish = Date.now() - serverCompileTime;

const clientCompileTime = Date.now();

esbuild.buildSync(ESBUILD_CONFIG);

const clientCompileFinish = Date.now() - clientCompileTime;

console.log(`Compile finished in ${Date.now() - deleteStart}ms`);
console.log(`Delete finished in ${deleteFinish}ms`);
console.log(`Client Compiled in ${clientCompileFinish}ms`);
console.log(`Server Compiled in ${serverCompileFinish}ms`);
console.log(`${compileCount} Files Built for server`);

function randomizeSharedContent(randomzieFilePath) {
  fs.readFile(randomzieFilePath, 'utf8', (err, content) => {
    if (err) {
      console.error('Fehler beim Lesen der Datei:', err);
      return;
    }

    // Finde alle Werte in '' und speichere sie in einem Array
    const regex = /'([^']*)'/g;
    let match;
    const values = [];

    while ((match = regex.exec(content))) {
      if (!isInDebugMode || match[0].length < 10) {
        values.push(match[0]);
      }
    }

    // Ersetze die Werte im Inhalt der Datei durch zufällige Werte
    let newContent = content;
    values.forEach(value => {
      newContent = newContent.replace(value, `'${uuidv4()}'`);
    });

    // Schreibe den neuen Inhalt zurück in die Datei
    if (values.length > 0) {
      fs.writeFile(randomzieFilePath, newContent, 'utf8', err => {
        if (err) {
          console.error('Fehler beim Schreiben der Datei:', err);
          return;
        }
      });
    }

    console.log(`Randomized values in ${new RegExp(/\/([^/]+)$/).exec(randomzieFilePath)[0]}: ${values.length}`);
  });
}
