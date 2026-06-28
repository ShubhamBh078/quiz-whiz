export async function fetchQuestionsFromAPI(category, difficulty, type) {
    let url = `https://opentdb.com/api.php?amount=10`;
    if (category) url += `&category=${category}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    if (type) url += `&type=${type}`;
    
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
}