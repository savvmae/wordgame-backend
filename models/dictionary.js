const fs = require('file-system');

var easy = [];
var normal = [];
var hard = [];

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

(function determineMode(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].length <= 6 && arr[i].length >= 4) {
            easy.push(arr[i]);
        } else if (arr[i].length <= 8 && arr[i].length >= 7) {
            normal.push(arr[i]);
        } else if (arr[i].length > 8) {
            hard.push(arr[i]);
        }
    }
})(words);


module.exports = {

    easy: easy,
    normal: normal,
    hard: hard

};


