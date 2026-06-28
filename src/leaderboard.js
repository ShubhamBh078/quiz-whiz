import { db } from './firebase.js';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { currentUser } from './auth.js'; 

const difficultyBadges = {
    "easy": "<span class='text-xs px-2 py-0.5 bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 rounded font-semibold ml-2'>Easy</span>",
    "medium": "<span class='text-xs px-2 py-0.5 bg-blue-950/50 text-blue-400 border border-blue-500/30 rounded font-semibold ml-2'>Medium</span>",
    "hard": "<span class='text-xs px-2 py-0.5 bg-red-950/50 text-red-400 border border-red-500/30 rounded font-semibold ml-2'>Hard</span>",
    "any": "<span class='text-xs px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded font-semibold ml-2'>Standard</span>"
};


export async function renderLeaderboard(highScoresList, filterValue) {
    const targetDifficulty = filterValue || "any";
    highScoresList.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-slate-400 italic animate-pulse">Syncing with cloud database...</td></tr>`;

    try {
        const scoresRef = collection(db, "scores");
        const q = query(
            scoresRef, 
            where("difficulty", "==", targetDifficulty), 
            orderBy("score", "desc"), 
            limit(5)
        );
        
        const querySnapshot = await getDocs(q);
        const filteredScores = [];
        querySnapshot.forEach((doc) => {
            filteredScores.push(doc.data());
        });

        if (filteredScores.length === 0) {
            highScoresList.innerHTML = `
                <tr>
                    <td colspan="3" class="py-4 text-center text-slate-500 font-medium italic">
                        No cloud scores recorded yet for this tier!
                    </td>
                </tr>`;
            return;
        }

        highScoresList.innerHTML = filteredScores.map((player, index) => {
            const badge = difficultyBadges[player.difficulty] || difficultyBadges["any"];
            return `
                <tr class="hover:bg-slate-800/20 transition-colors">
                    <td class="py-2 font-bold text-slate-500">${index + 1}</td>
                    <td class="py-2 font-semibold text-slate-200 flex items-center">${player.name} ${badge}</td>
                    <td class="py-2 font-bold text-emerald-400">${player.score}</td>
                </tr>`;
        }).join('');

    } catch (error) {
        console.error("Firebase Database Error: ", error);
        highScoresList.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-red-400 font-medium">Failed to fetch leaderboard from cloud!</td></tr>`;
    }
}

export async function saveHighScore(username, score, difficulty) {
    try {
        // 🌟 AUTOMATION LOGIC: Check if an authenticated user profile is active
        let finalDisplayName = username;
        
        if (currentUser && currentUser.email) {
            // Automatically split and extract prefix from email (e.g. "shubham9835bh" from "shubham9835bh@gmail.com")
            finalDisplayName = currentUser.email.split('@')[0].toUpperCase();
        }

        await addDoc(collection(db, "scores"), {
            name: finalDisplayName, // 👈 Saves auto-parsed username if logged in, or initials if guest
            score: Number(score),
            difficulty: difficulty,
            userId: currentUser ? currentUser.uid : "guest", 
            isPremiumUser: currentUser ? true : false, 
            createdAt: new Date()
        });
        
    } catch (error) {
        console.error("Error writing document to Firebase: ", error);
        alert("Could not sync your score to the cloud server.");
    }
}