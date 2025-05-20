// Esperar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar estilos CSS
    const style = document.createElement('style');
    style.textContent = `
        .tic-tac-toe {
            display: none;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            max-width: 300px;
            margin: 20px auto;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .cell {
            aspect-ratio: 1;
            background: white;
            border: 2px solid #4CAF50;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .cell:hover {
            background: #e8f5e9;
        }

        .x-mark {
            color: #4CAF50;
        }

        .o-mark {
            color: #2196F3;
        }

        .game-container {
            text-align: center;
            margin: 20px 0;
        }

        #startGame {
            margin: 20px auto;
            display: block;
        }
    `;
    document.head.appendChild(style);

    // Variáveis do jogo
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    // Função para criar o tabuleiro
    function createBoard() {
        const gameBoard = document.getElementById('gameBoard');
        if (!gameBoard) {
            console.error('Elemento gameBoard não encontrado!');
            return;
        }

        gameBoard.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => handleCellClick(i));
            gameBoard.appendChild(cell);
        }
    }

    // Função para verificar vitória
    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
            [0, 4, 8], [2, 4, 6] // Diagonais
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                return gameBoard[a];
            }
        }

        if (!gameBoard.includes('')) {
            return 'empate';
        }

        return null;
    }

    // Função para atualizar o tabuleiro
    function updateBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = gameBoard[index];
            if (gameBoard[index] === 'X') {
                cell.classList.add('x-mark');
            } else if (gameBoard[index] === 'O') {
                cell.classList.add('o-mark');
            }
        });
    }

    // Função para lidar com o clique na célula
    function handleCellClick(index) {
        if (gameBoard[index] === '' && gameActive) {
            gameBoard[index] = currentPlayer;
            updateBoard();

            const result = checkWin();
            if (result) {
                gameActive = false;
                if (result === 'empate') {
                    setTimeout(() => {
                        alert('Empate! Jogo terminado.');
                        resetGame();
                    }, 100);
                } else {
                    setTimeout(() => {
                        alert(`Jogador ${result} venceu!`);
                        resetGame();
                    }, 100);
                }
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    }

    // Função para resetar o jogo
    function resetGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        createBoard();
    }

    // Função para iniciar o jogo
    function startGame() {
        const gameBoard = document.getElementById('gameBoard');
        if (!gameBoard) {
            console.error('Elemento gameBoard não encontrado!');
            return;
        }
        gameBoard.style.display = 'grid';
        resetGame();
    }

    // Adicionar evento ao botão de iniciar
    const startButton = document.getElementById('startGame');
    if (startButton) {
        startButton.addEventListener('click', startGame);
        console.log('Botão de iniciar jogo encontrado e evento adicionado');
    } else {
        console.error('Botão de iniciar jogo não encontrado!');
    }
}); 