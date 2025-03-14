# Legislative Card Matching Game

A beautiful, interactive matching game where players match Montana legislative bill numbers with their corresponding descriptions. This game is designed to be educational and engaging, helping users learn about legislative bills in a fun way.

## Features

- Responsive design that works on both desktop and mobile devices
- Smooth card flipping animations
- Game statistics including timer, moves counter, and matches counter
- Winning screen with final statistics
- Pre-loaded with real Montana legislative bills

## How to Use

### Adding to WordPress

1. In your WordPress dashboard, go to the page where you want to add the game
2. Add a new HTML block (you may need to use a plugin like "Custom HTML Widget" or "HTML Widget Block" if your theme doesn't support HTML blocks)
3. Copy and paste the contents of the `wordpress-integration.html` file into the HTML block
4. Update or publish the page

### About the Bill Data

The game is already loaded with Montana legislative bill data extracted from the Summaries.docx file. The data includes bill numbers (like "SB 19" or "HB 287") and their corresponding descriptions.

The game will randomly select 15 bill pairs (30 cards total) from the full list for each game session to keep the gameplay manageable and engaging.

If you want to modify or update the bill data:

1. Open `script.js` or the WordPress integration file
2. Find the `billData` array (around line 23)
3. Edit or add to the array in the format: `['bill number', 'bill description']`

## Customization Options

You can easily customize the appearance of the game by modifying the CSS:

- Change the color scheme by updating the color values (e.g., `#1a3c6d`, `#e63946`)
- Adjust the card size by modifying the `#game-board` grid settings
- Change fonts, spacing, and other visual elements

## Browser Compatibility

This game works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

This game is free to use and modify for educational purposes. 