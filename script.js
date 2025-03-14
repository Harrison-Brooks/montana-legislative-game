document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const winScreen = document.getElementById('win-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const playAgainButton = document.getElementById('play-again-button');
    const gameBoard = document.getElementById('game-board');
    const matchesDisplay = document.querySelector('#matches span');
    const timerDisplay = document.querySelector('#timer span');
    const movesDisplay = document.querySelector('#moves span');
    const finalTimeDisplay = document.getElementById('final-time');
    const finalMovesDisplay = document.getElementById('final-moves');
    
    // Game state
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let totalPairs = 0;
    let moves = 0;
    let timer = 0;
    let timerInterval;
    let canFlip = true;
    
    // Bill data from the Summaries.docx document
    const billData = [
        ['SB 19', 'Revise sentencing laws related to theft'],
        ['HB 287', 'Generally revise laws related to dangerous drugs'],
        ['HB 332', 'Revise youth court laws'],
        ['HB 493', 'Revise firearm theft penalties'],
        ['SB 204', 'Sunset or reapprove existing voter approved property tax levies'],
        ['HB 21', 'Establish a Montana workforce housing tax credit'],
        ['HB 492', 'Revise laws related to parking requirements'],
        ['SB 121', 'Revise the land use planning act'],
        ['HB 378', 'Prohibit inclusionary zoning'],
        ['SB 213', 'Revise building code laws'],
        ['SB 243', 'Allow for increased density in housing developments'],
        ['SB 266', 'Revise municipal zoning to allow for triplex and fourplex housing'],
        ['SB 93', 'Revise income taxes related to retired military members'],
        ['HB 357', 'Fund middle school career and technical education'],
        ['HB 457', 'Increase childcare funding for military and defense'],
        ['HB 245', 'Extend Medicaid expansion expiration date'],
        ['SB 62', 'Provide for phaseout of Medicaid expansion program'],
        ['HB 230', 'Generally revise Medicaid laws'],
        ['SB 199', 'Revise the Medicaid expansion program'],
        ['HB 19', 'Require public hearing before certain tax increment finance bonding'],
        ['SB 1', 'Revise definition of "blighted area"'],
        ['SB 2', 'Revise treatment of tax increment'],
        ['SB 3', 'Establish advisory committee for districts that use tax increment financing'],
        ['SB 90', 'Redistribute certain state tax revenue to primary residence property tax relief'],
        ['HB 200', 'Increase total MEDIA act film tax credits'],
        ['HB 270', 'Revise remedies to MEPA'],
        ['HB 285', 'Generally revise Montana environmental policy act'],
        ['HB 291', 'Revise laws related to air quality'],
        ['SB 221', 'Generally revise the Montana environmental policy act'],
        ['HB 120', 'Define multifamily housing facility for C-PACE program'],
        ['HB 231', 'Revise property tax rates for certain properties'],
        ['HB 326', 'Tax electrical energy produced by coal'],
        ['HB 389', 'Provide for setbacks for wind turbine generators'],
        ['HB 313', 'Establish a grant program for aquatic recreational facilities']
    ];
    
    // Event listeners
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', resetGame);
    playAgainButton.addEventListener('click', resetGame);
    
    // Initialize the game
    function startGame() {
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        resetGame();
    }
    
    // Reset game state
    function resetGame() {
        // Reset game state
        winScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        gameBoard.innerHTML = '';
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        timer = 0;
        canFlip = true;
        
        // Update displays
        matchesDisplay.textContent = matchedPairs;
        movesDisplay.textContent = moves;
        timerDisplay.textContent = timer;
        
        // Clear previous timer
        clearInterval(timerInterval);
        
        // Start timer
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.textContent = timer;
        }, 1000);
        
        // Create and shuffle cards
        createCards();
    }
    
    // Create cards based on bill data
    function createCards() {
        // Determine the number of pairs to use based on the data available
        // Limit to 15 pairs (30 cards) for better gameplay
        const maxPairs = 15;
        const shuffledBills = shuffleArray([...billData]).slice(0, maxPairs);
        totalPairs = shuffledBills.length;
        
        // Create an array with each bill having two cards (bill number and description)
        let cardData = [];
        shuffledBills.forEach(bill => {
            // Card 1: Bill number (paired with a specific description)
            cardData.push({
                type: 'number',
                content: bill[0],
                pairId: bill[0]
            });
            
            // Card 2: Bill description (paired with a specific bill number)
            cardData.push({
                type: 'description',
                content: bill[1],
                pairId: bill[0]
            });
        });
        
        // Shuffle the cards
        cardData = shuffleArray(cardData);
        
        // Create card elements
        cardData.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.pairId = card.pairId;
            cardElement.dataset.index = index;
            
            // Create card inner (for flip animation)
            const cardInner = document.createElement('div');
            cardInner.className = 'card-inner';
            
            // Create front face (back of card when not flipped)
            const cardFront = document.createElement('div');
            cardFront.className = 'card-face card-front';
            cardFront.innerHTML = '<div>?</div>';
            
            // Create back face (shows content when flipped)
            const cardBack = document.createElement('div');
            cardBack.className = 'card-face card-back';
            
            if (card.type === 'number') {
                cardBack.innerHTML = `<div class="bill-number">${card.content}</div>`;
            } else {
                cardBack.innerHTML = `<div class="bill-description">${card.content}</div>`;
            }
            
            // Assemble card
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardElement.appendChild(cardInner);
            
            // Add click event
            cardElement.addEventListener('click', () => flipCard(cardElement));
            
            // Add to game board
            gameBoard.appendChild(cardElement);
            cards.push(cardElement);
        });
    }
    
    // Flip card logic
    function flipCard(card) {
        // Prevent flipping if animations are in progress or card is already flipped
        if (!canFlip || flippedCards.includes(card) || card.classList.contains('matched')) {
            return;
        }
        
        // Flip the card
        card.classList.add('flipped');
        flippedCards.push(card);
        
        // Check if two cards are flipped
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            
            // Check for match
            if (flippedCards[0].dataset.pairId === flippedCards[1].dataset.pairId) {
                // Match found
                matchedPairs++;
                matchesDisplay.textContent = matchedPairs;
                
                // Mark cards as matched
                flippedCards.forEach(card => {
                    card.classList.add('matched');
                });
                
                // Reset flipped cards
                flippedCards = [];
                
                // Check if game is complete
                if (matchedPairs === totalPairs) {
                    endGame();
                }
            } else {
                // No match, flip cards back
                canFlip = false;
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.remove('flipped');
                    });
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    }
    
    // End game and show win screen
    function endGame() {
        clearInterval(timerInterval);
        
        // Update win screen stats
        finalTimeDisplay.textContent = timer;
        finalMovesDisplay.textContent = moves;
        
        // Show win screen after a short delay
        setTimeout(() => {
            gameScreen.classList.add('hidden');
            winScreen.classList.remove('hidden');
        }, 1000);
    }
    
    // Utility function to shuffle an array
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}); 