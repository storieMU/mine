var myApp = angular.module('minesweeper', []);

function Main($scope) {
    $scope.alive = "";
    $scope.side = 8;
    // states:
    //  0 - hidden empty
    //  1 - hidden mine
    //  2 - revealed empty
    //  3 - revealed mine
    //  4 - missed empty
    $scope.state = new Array();

    $scope.range = function () {
        var input = [];
        for (var i = 0; i < $scope.side; i++) input.push(i);
        return input;
    };

    $scope.reveal = function (row, col) {
        if ($scope.state[row][col].value == 1) {
            $scope.pwnd();
        } else if ($scope.state[row][col].value == 0) {
            $scope.tryreveal(row, col);
        }
    };

    $scope.tryreveal = function (row, col) {
        if (row < 0 || row >= $scope.side || col < 0 || col >= $scope.side) return;

        if ($scope.state[row][col].value == 0) {
            $scope.state[row][col].value = 2;

            if ($scope.isz(row - 1, col - 1) && 
                $scope.isz(row - 1, col) && 
                $scope.isz(row - 1, col + 1) && 
                $scope.isz(row, col - 1) && 
                $scope.isz(row, col + 1) && 
                $scope.isz(row + 1, col - 1) && 
                $scope.isz(row + 1, col) && 
                $scope.isz(row + 1, col + 1)) {
                    $scope.tryreveal(row - 1, col - 1);
                    $scope.tryreveal(row - 1, col);
                    $scope.tryreveal(row - 1, col + 1);
                    $scope.tryreveal(row, col - 1);
                    $scope.tryreveal(row, col + 1);
                    $scope.tryreveal(row + 1, col - 1);
                    $scope.tryreveal(row + 1, col);
                    $scope.tryreveal(row + 1, col + 1);
            }
        }
    };
    
    $scope.pwnd = function () {
        for(var i = 0; i< $scope.side; i++) {
            for(var j = 0; j < $scope.side; j++) {
                if($scope.state[i][j].value == 0) {
                    $scope.state[i][j].value = 2;
                } else if($scope.state[i][j].value == 1) {
                    $scope.state[i][j].value = 3;
                }
            }
        }
        
        $scope.alive = "You lost!"
        play();
    };
    
    $scope.endmame = function () {
        if($scope.alive != "") {
            return;
        }
        
        var missed = false;
        for(var i = 0; i< $scope.side; i++) {
            for(var j = 0; j < $scope.side; j++) {
                if($scope.state[i][j].value == 0) {
                    missed = true;
                    $scope.state[i][j].value = 4;
                }
            }
        }
        
        if(missed) {
           $scope.pwnd();
        } else {
           $scope.alive = "You win!"
           win();
           play();
        }
    };

    function play() {
    if (localStorage.plays) {
        localStorage.plays = Number(localStorage.plays) + 1;
    } else {
        localStorage.clickcount = 0;
    }
    $scope.plays = localStorage.clickcount;
}
function win() {
    if (localStorage.plays) {
        localStorage.plays = Number(localStorage.plays) + 1;
    } else {
        localStorage.clickcount = 0;
    }
    $scope.wins = localStorage.clickcount;
}
    
    $scope.isz = function (row, col) {
        if (row < 0 || row >= $scope.side || col < 0 || col >= $scope.side)
            return true;

        return $scope.state[row][col].value == 0 || 
               $scope.state[row][col].value == 2 ||
               $scope.state[row][col].value == 4;
    };

    $scope.ct = function (st, row, col) {
        if ($scope.state[row][col].value == 0 || $scope.state[row][col].value == 1 || $scope.state[row][col].value == 3)
            return "";
        
        var ret = 
            !$scope.isz(row - 1, col - 1) + 
            !$scope.isz(row - 1, col) + 
            !$scope.isz(row - 1, col + 1) + 
            !$scope.isz(row, col - 1) + 
            !$scope.isz(row, col + 1) + 
            !$scope.isz(row + 1, col - 1) + 
            !$scope.isz(row + 1, col) + 
            !$scope.isz(row + 1, col + 1);
        
        if(ret == 0) {
            return "";
        }
        
        return ret;
    };

    $scope.cf = function (st) {
        if (st.value == 0 || st.value == 1)
            return 'gd gd-show';
        else if (st.value == 2)
            return 'gd gd-show';
        else if (st.value == 3)
            return 'gd gd-show-mine fa fa-bomb';
        else if (st.value == 4)
            return 'gd gd-show-missed';
    };

    $scope.initstate = function () {
        for (var i = 0; i < $scope.side; i++) {
            $scope.state[i] = new Array($scope.side);
            for (var j = 0; j < $scope.side; j++) {
                $scope.state[i][j] = {
                    value: 0
                };
            }
        }

        $scope.randme();
    };
    
    $scope.reinit = function () {
        $scope.alive = "";
        for (var i = 0; i < $scope.side; i++) {
            for (var j = 0; j < $scope.side; j++) {
                $scope.state[i][j].value = 0;
            }
        }

        $scope.randme();
    };
    
    $scope.randme = function () {
        var randscreated = 0;
        while (randscreated < 10) {
            var currentrow = Math.floor(Math.random() * ($scope.side));
            var currentcol = Math.floor(Math.random() * ($scope.side));

            if ($scope.state[currentrow][currentcol].value != 1) {
                $scope.state[currentrow][currentcol].value = 1;
                randscreated++;
            }
        }
    };
};
