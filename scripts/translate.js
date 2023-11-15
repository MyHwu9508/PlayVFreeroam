import fs from 'fs';
import readline from 'readline';
import { Configuration, OpenAIApi } from 'openai';
import path from 'path';

const API_KEY = 'API Key Here';

const LANG_PATH = '../lang/'; // Pfad zu den Sprachdateien
const DEFAULT_LANGUAGE = 'en'; // Standardsprache
const ALL_TARGET_LANGUAGES = getTargetLanguages();
const BATCH_SIZE = 10; //default 15 lower this to 5 or 1 for few remaining keys (buggy, idk)

const configuration = new Configuration({
  apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

async function translateKeys(keyValuePairs, targetLanguage) {
  try {
    const totalBatches = Math.ceil(keyValuePairs.length / BATCH_SIZE);

    const translations = {};

    for (let batchNumber = 0; batchNumber < totalBatches; batchNumber++) {
      const startIndex = batchNumber * BATCH_SIZE;
      const batchKeyValuePairs = keyValuePairs.slice(startIndex, startIndex + BATCH_SIZE);
      const promptTranslate = batchKeyValuePairs.map(([key, value]) => [key, value]);

      const batchContent = promptTranslate.map(([key, value]) => `${key}: ${value}`).join('\n');

      const prompt = `The enviroment is an user interface on an GTA5 multiplayer server. On this server users can interact with the game world and its entitys via this interface that is an interactive menu. The users are gamers that are able to understand gaming slang. Keep every translation simple and short.
Translate the following text to ISO 639-1 language code ${targetLanguage} and only output a JSON Object with key:value. Keep the key untouched but change the value to the translated text. For translation, consider using the key and values:\n
${batchContent}`;

      console.log(`Processing batch ${batchNumber + 1} of ${totalBatches}`);
      const response = await retryApiRequest(prompt);

      const responseData = response.data.choices[0].message.content;

      try {
        const batchTranslations = JSON.parse(responseData);

        for (const [key, translation] of Object.entries(batchTranslations)) {
          translations[key] = translation;
        }
      } catch (jsonParseError) {
        console.error('JSON parse error:', jsonParseError, JSON.stringify(responseData), JSON.stringify(prompt));
      }

      if (batchNumber < totalBatches - 1) {
        await delay(100); // Add a delay of 100 milliseconds between batches
      }
    }

    const sortedTranslations = Object.fromEntries(Object.entries(translations).sort());

    return sortedTranslations;
  } catch (error) {
    console.error('Translation error:', error);
    return {};
  }
}

function sortKeysAlphabetically(data) {
  const sortedData = Object.fromEntries(Object.entries(data).sort());
  return sortedData;
}

async function retryApiRequest(prompt) {
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      return await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0,
        max_tokens: 2048,
      });
    } catch (error) {
      console.error('API request error:', error);
      console.log(`Retrying API request (${retryCount + 1}/${maxRetries})`);
      retryCount++;
      await delay(1000); // Wait for 1 second before retrying
    }
  }

  throw new Error('API request failed after multiple retries');
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadLanguageFile(language) {
  const filePath = LANG_PATH + language + '.json';
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading language file ${filePath}:`, error);
    return null;
  }
}

function saveLanguageFile(language, data) {
  const filePath = LANG_PATH + language + '.json';
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    console.log(`Language file ${filePath} saved successfully.`);
  } catch (error) {
    console.error(`Error saving language file ${filePath}:`, error);
  }
}

function getTargetLanguages() {
  try {
    const files = fs.readdirSync(LANG_PATH);
    const targetLanguages = files.map(file => path.parse(file).name);
    return targetLanguages;
  } catch (error) {
    console.error('Error reading lang directory:', error);
    return [];
  }
}

async function translateAllKeysInFile(sourceLanguage, targetLanguages, overwriteAllValues = false) {
  const sourceData = loadLanguageFile(sourceLanguage);

  if (!sourceData) {
    console.error(`Source language file ${sourceLanguage}.json not found.`);
    return;
  }

  const keyValuePairs = Object.entries(sourceData);

  for (const targetLanguage of targetLanguages) {
    console.log('Start translating: ' + targetLanguage);
    const targetData = loadLanguageFile(targetLanguage) || {};
    const untranslatedKeys = [];

    for (const [key, value] of keyValuePairs) {
      if (!targetData[key] || overwriteAllValues === true) {
        untranslatedKeys.push([key, value]);
      }
    }

    if (untranslatedKeys.length > 0) {
      const translations = await translateKeys(untranslatedKeys, targetLanguage);

      for (const [key, translation] of Object.entries(translations)) {
        targetData[key] = translation;
      }

      const sortedTargetData = sortKeysAlphabetically(targetData);
      saveLanguageFile(targetLanguage, sortedTargetData);
      console.log(`Translation of ${untranslatedKeys.length} keys to ${targetLanguage} complete.`);
    } else {
      console.log(`All keys are already translated to ${targetLanguage}.`);
    }
  }

  console.log('Translation of all keys complete.');
}

async function main() {
  //sort default file
  const sortedSourceData = sortKeysAlphabetically(loadLanguageFile(DEFAULT_LANGUAGE));
  saveLanguageFile(DEFAULT_LANGUAGE, sortedSourceData);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let isRunning = true;

  while (isRunning) {
    console.log('Select an option:');
    console.log('1. Translate all untranslated keys to one language');
    console.log('2. Translate all untranslated keys to all target languages');
    console.log('3. Translate all keys to all target languages (overwrites all!)');

    await new Promise(resolve => {
      rl.question('Enter your choice: ', async choice => {
        switch (choice) {
          case '1':
            rl.question('Enter the target language: ', async key => {
              await translateAllKeysInFile(DEFAULT_LANGUAGE, [key]);
              console.log('Translation of one language complete.');
              resolve();
            });
            break;

          case '2':
            await translateAllKeysInFile(DEFAULT_LANGUAGE, ALL_TARGET_LANGUAGES);
            console.log('Translation of all files complete.');
            break;

          case '3':
            await translateAllKeysInFile(DEFAULT_LANGUAGE, ALL_TARGET_LANGUAGES, true);
            console.log('Translation of all files (overwrite) complete.');
            break;

          default:
            console.log('Invalid choice. Exiting the menu.');
            isRunning = false; // Exit the menu on invalid choice
            resolve();
            break;
        }
      });
    });
  }

  rl.close();
}

main();
