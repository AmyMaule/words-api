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
  return allWords.filter(word => word.length === numLetters);
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

app.listen(
  port,
  () => console.log(`Server running on port ${port}`)
);

// lettersMin and lettersMax endpoints?