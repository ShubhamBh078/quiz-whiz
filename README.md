# Quiz Whiz

**Live Demo:** [https://quizwhiz-85d6a.web.app](https://quizwhiz-85d6a.web.app)

A lightweight, fast-loading trivia web app I built to get hands-on experience connecting a Vite front-end to a Firebase cloud backend. It pulls dynamic question sets from the OpenTDB API, tracks scores against a ticking timer, and pushes high scores to a global leaderboard.

## The Tech Stack
* **Frontend:** Vanilla JavaScript (ES6+), HTML5
* **Styling:** Tailwind CSS
* **Build Tool:** Vite
* **Backend:** Firebase (Firestore NoSQL, Authentication, Hosting)
* **External Data:** Open Trivia Database (OpenTDB) API

## Core Features
* **Hybrid Login System:** Players can jump into a game instantly as a guest, or register a secure email/password account.
* **Smart Leaderboard:** If logged in, the app bypasses the initials screen and auto-saves the user's score to the Firestore database. The leaderboard filters rankings based on the quiz difficulty.
* **Post-Game Review:** Generates a dynamic report card at the end of the match showing the player's correct and incorrect choices.
* **State Management:** Handles active timers, audio muting, and UI rendering cleanly without a heavy framework like React.

## Local Setup

To run this project on your own machine:

1. Clone this repository:
   ```bash
   git clone [https://github.com/ShubhamBh078/quiz-whiz.git](https://github.com/ShubhamBh078/quiz-whiz.git)
   ```
2. Navigate into the directory and install dependencies:
   ```bash
   cd quiz-whiz
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```

*(Note: To get the database and auth working locally, you will need to add your own `src/config.js` file with your specific Firebase project credentials).*
