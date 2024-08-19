# Pixel Fighters: August 2024 Hackathon

![Mockup responsive screen](PixelFighters/assets/ReadMe_images/Hacathon_team_4_mockup_responsive_screen.png)

[Visit the deployed site](#)
## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [How to Run](#how-to-run)
4. [User Stories](#user-stories)
5. [Criteria](#criteria)
6. [Design](#design)
   - [Logo Design](#logo-design)
   - [Wireframes](#wireframes)
   - [Colour Scheme](#colour-scheme)
   - [Font](#font)
7. [Accessibility](#accessibility)
8. [Responsiveness](#responsiveness)
9. [Features](#features)
10. [Technology Used](#technology-used)
11. [Challenges and Learning](#challenges-and-learning)
12. [Future Improvements](#future-improvements)
13. [Contributing](#contributing)
14. [License](#license)
15. [Credits](#credits)
16. [Team](#team)
---

## Overview

**Pixel Fighters** is a retro-inspired 2D fighting game that transports players back to the golden age of 8-bit video games. Built with modern technologies like HTML5, CSS3, and JavaScript, and powered by the Phaser game framework, this game allows players to select characters and engage in dynamic battles in a pixel-art environment. The game is designed for two players, offering a nostalgic yet thrilling experience reminiscent of classic arcade fighting games.

## Project Structure

- **`index.html`**: The main entry point for the game, containing the structure of the game’s homepage.
- **`css/`**: Directory containing all CSS files, including styles for the homepage, game UI, and other components.
  - `home.css`: Styles specific to the homepage.
  - `game.css`: Styles for the main gameplay interface.
- **`js/`**: Directory for JavaScript files managing game logic, UI interactions, and utility functions.
  - `main.js`: The primary game logic.
  - `utils.js`: Utility functions used across different parts of the game.
- **`assets/`**: Directory storing all game assets, including:
  - **Sprites**: Pixel art characters, backgrounds, and items.
  - **Audio**: 8-bit background music and sound effects.
  - **Logos**: Game and team logos.
  - **Images**: Used in the README and wireframes.

## How to Run

1. Clone the repository to your local machine.
2. Open `index.html` in a web browser.
3. Enjoy the game!

## User Stories

### Navigation

- As a player, I want to see the title of the game, "Pixel Fighters," immediately upon opening the website, with clear access to options such as "Start," "How to Play," and "About the Game."
- I want to experience a nostalgic vibe with a large pixelated logo and a simple menu to instantly recognize the genre of the game.
- I want to hear upbeat, 8-bit background music that aligns with the retro theme, creating an engaging and inviting atmosphere.
- I want menu options that change color when hovered over with the cursor or navigated using the keyboard, providing a visual cue for navigation.
- I want the selected option to change color and produce a sound effect to confirm my choice, enhancing the overall interactive experience.

### Start

- I want the "Start" button to be the first option in the menu, allowing me to jump straight into the game quickly.

### How to Play

- I want an option to learn the rules and controls of the game, helping me understand how to play and improve my performance.

### Playing the Game

- I expect to immediately identify my character to begin the game confidently.
- I want to easily distinguish between my character and the opponent to avoid confusion during gameplay.
- I want engaging background music to maintain my focus and enjoyment throughout the game.
- I want sound effects that correspond to my character’s actions, such as jumping or attacking, for an immersive experience.
- I want to see a health bar to track the progress of the battle and understand whether I'm winning or losing.
- I want a clear "win" or "lose" message at the end of the game to know who won or lost.

### About the Game

- I want to understand the purpose behind creating this game and what inspired it.
- I want to see a list of contributors involved in the project, including their roles and contributions.

## Criteria

- **The project is a retro game.**
- **The project features 8-bit music and sound effects.**
- **The project is fun to play.**
- **The project inspires a strong feeling of nostalgia.**
- **The project is presented to the judges in a fun and creative manner.**

## Design

### Logo Design

- **Game Logo**: A pixel font design featuring Marvel characters, displayed on every page.
  ![Game Logo](PixelFighters/assets/Logo/Logo_1.png)
  
- **Team Logo**: Represents our team, "Retro Rookies," with a network image symbolizing our collaboration through GitHub.
  ![Team Logo](PixelFighters/assets/Logo/Repro_Rookie_Logo_1.png)

### Wireframes

The wireframes below represent the preliminary designs for the game pages:

- **Home Page**
  <details>
    <summary>View Wireframe</summary>
    <img src="PixelFighters/assets/ReadMe_images/Wireframe1.jpg" alt="Wireframe home page">
  </details>

- **Game Page**
  <details>
    <summary>View Wireframe</summary>
    <img src="PixelFighters/assets/ReadMe_images/Wireframe3.jpg" alt="Wireframe Game page">
  </details>

- **How to Play Page**
  <details>
    <summary>View Wireframe</summary>
    <img src="PixelFighters/assets/ReadMe_images/Wireframe2.jpg" alt="Wireframe How to play page">
  </details>

- **About Page**
  <details>
    <summary>View Wireframe</summary>
    <img src="PixelFighters/assets/ReadMe_images/Wireframe4.jpg" alt="Wireframe About page">
  </details>

### Colour Scheme

The game uses a vibrant and nostalgic color palette reminiscent of classic 8-bit games.

### Font

- The font used across all pages is **[Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans?query=Pixel)**, a Google font that complements the retro theme.

## Accessibility

- The game is built with accessibility in mind, using semantic HTML and ensuring that the gameplay experience is responsive across various devices and screen sizes.

## Responsiveness

- The CSS framework Bootstrap is used to provide a responsive experience across devices of various sizes however restricted by the game container and purpose. It should be played with a keyboard.

## Features

- **Character Selection**: Players can choose their characters from a selection of pixel art heroes.
- **Health and Mana Bars**: Visual indicators for each player to track health and mana levels.
- **Power-Ups**: Collectible items that provide temporary boosts such as increased damage, speed, or health.
- **Trap Logic**: Various traps and obstacles on the battlefield that players must avoid to survive.
- **Dynamic Sound Effects**: Includes 8-bit sound effects and music to enhance the retro gaming experience.
- **Responsive Design**: The game adjusts to different screen sizes, ensuring a consistent experience across all devices.

## Technology Used

- **HTML5**
- **CSS3**
- **JavaScript**
- **[Phaser](https://phaser.io/download/stable)** (v3.80.1 "Nino"): A fast, free, and fun open-source HTML5 game framework.
- **[Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/)** (v5.0.2): A popular CSS framework for building responsive websites.
- **Adobe Photoshop**: Used by Robert Quinlan to create the design logo and character sprites.

## Credits

### Media

- **Images**:
  - [Vecteezy](https://www.vecteezy.com/vector-art/45562049-affiliate-marketing-icon-design): Used to create the "Retro Rookies" team logo.
  - [Logo github](https://github.com/logos): Used for GitHub profile links in the footer.
  - Marvel character images:
    - [Blade Character](https://marvelsnapzone.com/variants/blade-01/)
    - [Wolverine Character](https://ie.pinterest.com/pin/33214115995401644/)
    - [Terminator Character](https://ie.pinterest.com/pin/671036413228810134/)

- **Sound Effects**:
  - Background music and sound effects were downloaded from [Pixabay](https://pixabay.com/).

## Team

- **Dimitri Edel**: [GitHub](https://github.com/dimitri-edel)
- **Maushum Gurrung**: [GitHub](https://github.com/grgmausham)
- **Jesse Lee Ross**: [GitHub](https://www.github.com/jesseross001)
- **Robert Quinlan**: [GitHub](https://github.com/RQISL)

---
## Challenges and Learning

Throughout the development of Pixel Fighters, our team encountered several challenges that tested our skills and pushed us to learn new technologies and methodologies:

- **Character Animation:** Implementing smooth and responsive animations for the characters was initially difficult. We had to experiment with frame rates and sprite sheet configurations to achieve the desired fluidity in movements and attacks.
  
- **Collision Detection:** Handling precise collision detection between characters and various elements (such as traps and power-ups) required careful tuning. We learned how to balance performance with accuracy in a fast-paced game environment.

- **Audio Integration:** Integrating 8-bit sound effects and music that matched the retro aesthetic of the game involved both creative and technical challenges. We had to ensure that the sound effects were not only engaging but also appropriately timed with in-game actions.

- **Responsive Design:** Ensuring that the game played well on different screen sizes, while maintaining the pixel-art integrity, was a balancing act. We learned to use CSS media queries and Bootstrap effectively to adapt the UI without losing the retro feel.


----

## Future Improvements

While Pixel Fighters is fully functional, there are several enhancements and features we plan to add in the future:

- **Online Multiplayer:** Implementing an online multiplayer mode where players can battle against each other over the internet.
  
- **Additional Characters and Levels:** Expanding the game by adding more characters with unique abilities and designing new levels with varied environments and challenges.

- **AI Opponent:** Adding an AI-controlled opponent for single-player mode, with adjustable difficulty levels to cater to players of all skill levels.

- **Leaderboards and Achievements:** Introducing a leaderboard system and achievements to increase replayability and competitiveness among players.

- **Mobile Optimization:** Further optimizing the game for mobile devices to ensure smooth gameplay on smaller screens and touch controls.
----

## Contributing

We welcome contributions from the community! If you would like to contribute to Pixel Fighters, please follow these guidelines:

1. **Fork the repository**: Click on the "Fork" button at the top right of the repository page to create a copy of the repository in your GitHub account.
2. **Clone your fork**: Clone your forked repository to your local machine using `git clone https://github.com/YOUR-USERNAME/PixelFighters.git`.
3. **Create a new branch**: Create a new branch for your feature or bug fix using `git checkout -b feature-branch-name`.
4. **Make your changes**: Implement your changes and commit them with a clear and concise commit message.
5. **Push to GitHub**: Push your changes to your forked repository on GitHub using `git push origin feature-branch-name`.
6. **Submit a pull request**: Open a pull request to the original repository, providing a detailed description of your changes and the issue you are addressing.

We will review your pull request and provide feedback. Once approved, your changes will be merged into the main repository.
----
This project was created as part of the August 2024 Hackathon. We hope you enjoy playing **Pixel Fighters** as much as we enjoyed creating it!
