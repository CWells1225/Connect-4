class Game {
    constructor(container) {
        this.ROWS = 6;
        this.COLS = 7;
        this.isGameOver = false;
        this.player = 'red';
        this.container = container;
        this.createGrid(); 
        this.setupEventListeners();
    }

    onPlayerMove() {
        document.getElementById("player").innerText = this.player.toUpperCase();
    }

    createGrid() {
        const container = document.getElementById(this.container); // 
        container.innerHTML = "";
        this.isGameOver = false;
        this.player = 'red';
        for (let i = 0; i < this.ROWS; i++) {
            const row = document.createElement('div')
            row.setAttribute('class','row')
            console.log(row)
            for (let j = 0; j < this.COLS; j++) {
                const col = document.createElement('div');
               col.setAttribute('class', 'col empty')
                col.setAttribute('col', j) // 'col' is the name of the id and j is the numeric value 
                col.setAttribute('row', i) // 'row' is the name of the id and i is the numeric value
                // col.innerHTML = `i = ${i}, <br> j = ${j}`

                row.appendChild(col);
            }
            container.appendChild(row);
        }
    }

    setupEventListeners() {

        function findLastEmptyCell(col) {
            const cells = document.querySelectorAll(`.col[col='${col}']`); // here we are selecting the columns with a class of col and an id of col and ${col} means any column no specific #
            console.log(cells);
            for (let i = cells.length - 1; i >= 0; i--) { //
                if (cells[i].classList.contains('empty')) { // if cell/slot is empty this function will return the cell that is empty 
                    return cells[i];
                }
            }
            return null; // if its not empty it will null -- nothing will happen 
        }

        document.querySelectorAll('.col.empty').forEach(item => {
            item.addEventListener('mouseenter', event => {
                console.log(event.target);
                const col = event.target.getAttribute('col')
                const lastEmptyCell = findLastEmptyCell(col)
                lastEmptyCell.classList.add(`place-${this.player}`); // (`place-${this.player}`) if cell is empty this will place the color of the piece in the cell (slightly red/black when hovered)
            })//this fxn allow player to use mouse to hover over cells where cell is empty 
        })

        document.querySelectorAll('.col').forEach(item => {
            item.addEventListener('mouseleave', event => {
                const col = event.target.getAttribute('col')
                const lastEmptyCell = findLastEmptyCell(col)
                lastEmptyCell.classList.remove(`place-${this.player}`);//this function allows player to remove mouse from slot if player decides not to place piece in cell anymore
            })
        })

        document.querySelectorAll('.col').forEach(item => {
            item.addEventListener('click', event => {
                event.stopPropagation();
                if (this.isGameOver) return;
                const col = event.target.getAttribute('col')
                const lastEmptyCell = findLastEmptyCell(col);
                lastEmptyCell.classList.remove('empty', `place-${this.player}`)
                lastEmptyCell.classList.add(this.player);
                lastEmptyCell.setAttribute('player', this.player);
                //function above allows player to click the cell to place their piece. looking for an empty cell so that player can place their piece
                const winner = this.checkForWinner(lastEmptyCell.getAttribute('row'), lastEmptyCell.getAttribute('col'))
                    if (winner) {
                    this.isGameOver = true;
                    const winAudio = document.getElementById("win"); 
                    console.log(winAudio); 
                    winAudio.play();
                    alert(`Game Over! Player ${this.player} has won!`)
                    return; 
                    // const confetti = document.getElementById("confetti");
                    // confetti.start(); 
                 
                    
                     // startConfetti(); 

                } 

                if (this.player === 'red') {
                    this.player = 'black'
                } else {
                    this.player = 'red'
                }
                this.onPlayerMove();

               
               const playSound = document.getElementById("select");
               console.log(playSound); 
               playSound.play(); 

               
            }) 
        })
    }

    checkForWinner(row, col) {
        let _this = this; 

        function getCell(i, j) {
            return document.querySelector(`.col[row='${i}'][col='${j}']`)
        }

        function checkDirection(direction) {
            let total = 0;
            let i = Number(row) + direction.i;
            let j = Number(col) + direction.j;
            let next = getCell(i, j);
            let player = next && next.getAttribute('player') ? next.getAttribute('player') : null;
            while (i >= 0 && i < _this.ROWS && j >= 0 && j < _this.COLS && player === _this.player) {
                console.log('next', next);
                total++;
                i += direction.i;
                j += direction.j;
                next = getCell(i, j);
                player = next && next.getAttribute('player') ? next.getAttribute('player') : null;
            }
            return total
        }

        function checkWin(directionA, directionB) {
            const total = 1 + checkDirection(directionA) + checkDirection(directionB);
            if (total >= 4) {
                return _this.player;
            } else {
                return null;
            }
        }

        function checkVerticals() {
            return checkWin({ i: -1, j: 0 }, { i: 1, j: 0 })
            // -1 is left and 1 is right  
        }

        function checkHorizontals() {
            return checkWin({ i: 0, j: -1 }, { i: 0, j: 1 })
            //-1 is up and 1 is down 
        }

        function checkDiagonalTLtoBR() {//down to right
            return checkWin({ i: 1, j: 1 }, { i: -1, j: -1 })
            //
        }

        function checkDiagonalBLtoTR() {//topright 
            return checkWin({ i: 1, j: -1 }, { i: -1, j: 1 })
        }

        return checkVerticals() || checkHorizontals() || checkDiagonalTLtoBR() || checkDiagonalBLtoTR()
        return checkVerticals();
    }

    restart() {
        // stopConfetti();
        this.createGrid();
        this.onPlayerMove();
        this.setupEventListeners();
       
    }
}


// Goals

// As a player, I want my game to recognize 4 like colors of 4 in a row so winner can be identified. x
// As a player, I would like to be informed when the game results to a draw/tie between players. 
// As a player, I would like to know whose turn it is so that I don’t have to keep track. x
// As a player, I would like to be able to restart game after a win, loss, or tie. x
// As a player, I want the  user interface to be interactive and out of the way so that I enjoy the experience of playing the game. 
// As a player, I would like a victory animation when I win the game, so that I feel good about my victory. 
// As a player, I would like to hear an audible sound when I mark a game box so that I know my selection worked. x


// 2-3 slots prompt Swap: Do you  want to swap pieces with your opponet? 
// if Y .. swap then opponent goes
//if N .. no swap then opponent turn

// 2-3 slots prompt skip a turn 
//causes opponent to skip a turn 