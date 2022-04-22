const fs = require("fs")
const path = require("path")
const express = require("express");

const app = express();
const port = 80;

// words.txt has the top 1500 filtered most common words
const wordsAndFrequency = fs.readFileSync(path.resolve(__dirname, 'words.txt'), 'utf8').split("\r\n")

// Split each line into word and frequency (the number of times it appears in a wikipedia article) and return only the word
const allWords = wordsAndFrequency.map(word => word.split(" ")[0]);

// Return words in order of frequency
const getByPosition = (start, end) => {
  const wordsByPosition = [];

  for (let i = start; i <= end; i++) { 
    if (allWords[i]) wordsByPosition.push(allWords[i]);
  }
  return wordsByPosition;
}

const getWordsByPosition = (start = 0, end = 1499) => {
  const positionedWords = {};

  // Convert string values of start and end to numbers
  start = Number(start);
  end = Number(end);

  // If start is greater than end, swap values
  if (start > end) {
    [start, end] = [end, start];
  }

  // if start and end are not between 0 and 1499, set them to 0 and 1499, respectively
  start = (start >= 0 && start <= 1499) ? start : 0;
  end = (end >= 0 && end <= 1499) ? end : 1499;

  let startHundred = Math.floor(start/100);
  let endHundred = Math.floor(end/100);

  for (let i = startHundred; i <= endHundred; i++) {
    // if start and end are within 100 of each other
    if (start % 100 !== 0 && i === startHundred && end + 1 % 100 !== 0 && i === endHundred) {
      positionedWords[`${start}-${end}`] = getByPosition(start, end);  
    
    // if start is not divisible by 100
    } else if (start % 100 !== 0 && i === startHundred) {
      positionedWords[`${start}-${i * 100 + 99}`] = getByPosition(start, i*100 + 99);
    
    // if end does not end in 99
    } else if (end + 1 % 100 !== 0 && i === endHundred) {
      positionedWords[`${i * 100}-${end}`] = getByPosition(i * 100, end);

    } else {
      // gives positionedWords[0-99], positionedWords[100-199], etc
      positionedWords[`${i * 100}-${i * 100 + 99}`] = getByPosition(i*100, i*100 + 99);
    }
  }
  return positionedWords;
}

// Return words in order of length
const getByLength = numLetters => {
  const wordsByLength = allWords.filter(word => word.length === numLetters);
  const hundreds = Math.ceil(wordsByLength.length / 100);

  const sortedWordsByLength = {};

  for (let i = 1; i < hundreds + 1; i++) {
    const currentHundred = [];
    for (let j = 0; j < 100; j++) {
      if (wordsByLength[j]) currentHundred.push(wordsByLength[j])
    }

    sortedWordsByLength[Object.keys(sortedWordsByLength).length * 100 + "-" +  (100 * i - 1)] = currentHundred;
    wordsByLength.splice(0, 100);
  }

  return sortedWordsByLength;
}

// Return words between a minimum and maximum length only
const getWordsByLength = (min = 2, max = 14) => {
  const minMaxWords = {};

  // Convert string values of min and max to numbers
  min = Number(min);
  max = Number(max);

  // If min is greater than max, swap values
  if (min > max) {
    [min, max] = [max, min];
  }

  // if min and max are not between 2 and 14, set them to 2 and 14, respectively
  min = (min >= 2 && min <= 14) ? min : 2;
  max = (max >= 2 && max <= 14) ? max : 14;

  // add the values for each word length to the minMaxWords object
  for (let i = min; i <= max; i++) {
    minMaxWords[i + "_letters"] = getByLength(i);
  }
  return minMaxWords;
}

const apiBase = {
  "title": "Most common English words by Wikipedia frequency",
  "description": "This API provides the most common English words used in Wikipedia articles, using the results generated from https://github.com/IlyaSemenov/wikipedia-word-frequency. Proper nouns, place names, non-English words, single-letter words, political, religious and inappropriate words have been removed.",
  "license": {
    "name": "MIT License",
    "url": "https://choosealicense.com/licenses/mit/"
  },
  "version": "1.0.1"
};

app.get("/api/words", (req, res) => {
  apiBase["words_by_position"] = getWordsByPosition();
  apiBase["words_by_length"] = getWordsByLength();
  res.json(apiBase)
});

app.get("/api/wordsbyposition", (req, res) => {
  const { start, end } = req.query;
  apiBase["words_by_position"] = getWordsByPosition(start, end);
  res.json(apiBase)
});


app.get("/api/wordsbylength", (req, res) => {
  const { minLength, maxLength } = req.query;
  apiBase["words_by_length"] = getWordsByLength(minLength, maxLength);
  res.json(apiBase)
});

app.listen(port);