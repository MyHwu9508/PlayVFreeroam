import alt from 'alt-server';

const badWords = JSON.parse(alt.File.read('@assets/badWords.json'));

const specialBadWords = ['nigger', 'hurensohn'];

const allBadWords = [];
//TODO types weird?
//put all words in one array
for (const [_, values] of Object.entries(badWords)) {
  allBadWords.push(...values);
}

export function levenshteinDistance(a: string, b: string): number {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length;
  const n = b.length;
  const dp: number[][] = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
  }

  for (let j = 1; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  return dp[m][n];
}

export function doesStringContainBadWord(content: string, leviCheck: boolean = true, threshold: number = 2) {
  const normalizedContent = content.toLowerCase().replace(/[146306]/g, char => {
    const replacements: { [key: string]: string } = {
      '1': 'i',
      '4': 'a',
      '0': 'o',
      '3': 'e',
      '6': 'g',
    };
    return replacements[char] || char;
  });

  const words = normalizedContent.split(/\s+/);
  const foundWords = words.filter(word => {
    return allBadWords.includes(word);
  });

  if (leviCheck) {
    const similarWords: string[] = [];
    for (const word of words) {
      for (const badWord of specialBadWords) {
        if (levenshteinDistance(word, badWord) <= threshold) {
          similarWords.push(word);
        }
      }
    }
    const resultLevi = [...new Set([...foundWords, ...similarWords])];
    return resultLevi.length > 0 ? resultLevi : false;
  }
  return foundWords.length > 0 ? foundWords : false;
}
