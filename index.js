// start at 1123 of most common words
require("dotenv").config();
const fs = require("fs")
const path = require("path")
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const wordsAndFrequency = fs.readFileSync(path.resolve(__dirname, 'words.txt'), 'utf8').split("\r\n")

// Split each line into word and frequency (the number of times it appears in a wikipedia article) and return only the word
const allWords = wordsAndFrequency.map(word => word.split(" ")[0]);

// Return words in order of frequency
const getByPosition = (start, end) => {
  const wordsByPosition = [];
  for (let i = start; i < end; i++) {
    wordsByPosition.push(allWords[i]);
  }
  return wordsByPosition;
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

app.get("/api/words", (req, res) => {
  res.json({
    "title": "Most common English words by Wikipedia frequency",
    "description": "This API provides the most common English words used in Wikipedia articles, using the results generated from https://github.com/IlyaSemenov/wikipedia-word-frequency. Proper nouns, place names, non-English words, single-letter words, political and inappropriate words have been removed.",
    "words_by_position": {
      "0-99": getByPosition(0, 99),
      "100-199": getByPosition(100, 199),
      "200-299": getByPosition(200, 299),
      "300-399": getByPosition(300, 399),
      "400-499": getByPosition(400, 499),
      "500-599": getByPosition(500, 599),
      "600-699": getByPosition(600, 699),
      "700-799": getByPosition(700, 799),
      "800-899": getByPosition(800, 899),
      "900-999": getByPosition(900, 999)
    },
    "words_by_length": {
      "2-5": {
        "2_letters": getByLength(2),
        "3_letters": getByLength(3),
        "4_letters": getByLength(4),
        "5_letters": getByLength(5)
      },
      "6-9": {
        "6_letters": getByLength(6),
        "7_letters": getByLength(7),
        "8_letters": getByLength(8),
        "9_letters": getByLength(9),
      },
      "10-14": {
        "10_letters": getByLength(10),
        "11_letters": getByLength(11),
        "12_letters": getByLength(12),
        "13_letters": getByLength(13),
        "14_letters": getByLength(14)
      }
    },
    "license": {
      "name": "MIT License",
      "url": "https://choosealicense.com/licenses/mit/"
    },
    "version": "1.0.1"
  })
});

app.get("/api/wordsbyposition", (req, res) => {
  res.json({
    "title": "Most common English words by Wikipedia frequency",
    "description": "This API provides the most common English words used in Wikipedia articles, using the results generated from https://github.com/IlyaSemenov/wikipedia-word-frequency. Proper nouns, place names, non-English words, single-letter words, political and inappropriate words have been removed.",
    "words_by_position": {
      "0-99": getByPosition(0, 99),
      "100-199": getByPosition(100, 199),
      "200-299": getByPosition(200, 299),
      "300-399": getByPosition(300, 399),
      "400-499": getByPosition(400, 499),
      "500-599": getByPosition(500, 599),
      "600-699": getByPosition(600, 699),
      "700-799": getByPosition(700, 799),
      "800-899": getByPosition(800, 899),
      "900-999": getByPosition(900, 999)
    },
    "license": {
      "name": "MIT License",
      "url": "https://choosealicense.com/licenses/mit/"
    },
    "version": "1.0.1"
  })
});

app.get("/api/wordsbylength", (req, res) => {
  const { minLength, maxLength } = req.query;

  const apiBase = {
    "title": "Most common English words by Wikipedia frequency",
    "description": "This API provides the most common English words used in Wikipedia articles, using the results generated from https://github.com/IlyaSemenov/wikipedia-word-frequency. Proper nouns, place names, non-English words, single-letter words, political and inappropriate words have been removed.",
    "license": {
      "name": "MIT License",
      "url": "https://choosealicense.com/licenses/mit/"
    },
    "version": "1.0.1"
  };

  const minMaxWords = {};

  const getWordsByLength = (min = 2, max = 14) => {
    // Convert string values of min and max to numbers
    min = Number(min);
    max = Number(max);

    // If min is greater than max, swap values
    if (min > max) {
      [min, max] = [max, min];
    }

    // if min and max are not between 2 and 14, set them to 2 and 14, respectively
    min = (min >= 2 && min <= 14) ? min : 2;
    max = (min >= 2 && max <= 14) ? max : 14;

    // add the values for each word length to the minMaxWords object
    for (let i = min; i <= max; i++) {
      minMaxWords[i + "_letters"] = getByLength(i);
    }

  }
  getWordsByLength(minLength, maxLength);

  apiBase["words_by_length"] = minMaxWords;

  res.json(apiBase)
});

app.listen(port);