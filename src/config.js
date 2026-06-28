export const categoryThemes = {
    "  ": "/pictures/default_universe.jpg",
    "17": "/pictures/science.jpg", 
    "23": "/pictures/history.jpg", 
    "21": "/pictures/sports.jpg", 
    "22": "/pictures/geography.jpg", 
    "11": "/pictures/movies.jpg"  
};

export function getScoreMessage(finalScore, difficulty) {
    if (difficulty === 'easy') {
        if (finalScore === 100) return "☀️ Perfect! You crushed Easy mode. Ready to scale up to Medium?";
        if (finalScore >= 70) return "👍 Great job! Easy mode was an absolute breeze for you.";
        if (finalScore >= 40) return "🌱 A decent pass, but on Easy mode, you can definitely push higher!";
        return "🙃 Oof! Even for Easy mode, that was tricky. Time to practice!";
    } else if (difficulty === 'hard') {
        if (finalScore === 100) return "👑 GOD MODE UNLOCKED! A perfect score on HARD?! You are an absolute champ! 🚀";
        if (finalScore >= 50) return "🔥 Spectacular! Defeating Hard mode with this score is legendary status!";
        if (finalScore >= 20) return "🛡️ Massive respect! Scraping hard mode is a brilliant effort.";
        return "💀 Hard mode doesn't pull its punches! Shake it off, learn from the review, and retry.";
    } else {
        if (finalScore === 100) return "🧠 Absolute Genius! Perfect score! Time to level up!";
        if (finalScore >= 70) return "Brilliant! You really know your stuff.";
        if (finalScore >= 50) return "Not bad at all! Solid performance, but room to learn more.";
        if (finalScore >= 30) return "Keep practicing! The universe has many secrets left for you to uncover.";
        return "Oof, tough break! Time to hit the textbooks and try again!";
    }
}

export function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}