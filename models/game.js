

game = {

    evaluateGuess: function (arr, guess) {
        for (var i = 0; i < arr.length; i++) {
            if (arr.indexOf(guess) != -1) {
                var index = arr.indexOf(guess);
                arr.splice(index, 1);
            }
        }
        return arr;
    },

    letterAppear: function (arr1, arr2, guess) {
        for (var i = 0; i <= arr1.length; i++) {
            while (arr2.indexOf(guess) != -1) {
                var index = arr2.indexOf(guess);
                arr2.splice(index, 1, "/");
                arr1.splice(index, 1, guess);
            }
        }
        return arr1;
    },

    isLetter: function (input) {
        var letters = /^[A-Za-z]+$/;
        if (input.match(letters)) {
            return true;
        } else {
            return false;
        }
    }
};

module.exports = game;