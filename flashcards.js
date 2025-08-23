function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


// Load flashcards from localStorage
let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
let current = 0;
let score = 0;

// Save flashcards to localStorage
function saveFlashcards() {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

// Add new flashcard
function addFlashcard() {
  const q = document.getElementById("newQuestion").value.trim();
  const a = document.getElementById("newAnswer").value.trim();

  if (q && a) {
    flashcards.push({ question: q, answer: a });
    saveFlashcards();
    updateFlashcardList();
    document.getElementById("status").textContent = "✅ Flashcard added!";
    document.getElementById("newQuestion").value = "";
    document.getElementById("newAnswer").value = "";
  } else {
    document.getElementById("status").textContent = "❌ Please fill both fields.";
  }
}

// Clear all flashcards
function clearFlashcards() {
  if (confirm("Are you sure you want to delete all flashcards?")) {
    flashcards = [];
    saveFlashcards();
    updateFlashcardList();
    document.getElementById("status").textContent = "🗑️ All flashcards cleared!";
    document.getElementById("flashcardArea").style.display = "none";
  }
}

// Display the list of flashcards
function updateFlashcardList() {
  const list = document.getElementById("flashcardList");
  list.innerHTML = "";
  flashcards.forEach((card, index) => {
    const li = document.createElement("li");
    li.textContent = `${card.question} → ${card.answer}`;
    list.appendChild(li);
  });
}

// Start the quiz
function startQuiz() {
  if (flashcards.length === 0) {
    alert("Add some flashcards first!");
    return;
  }

  current = 0;
  score = 0;
  document.getElementById("flashcardArea").style.display = "block";
  showQuestion();
}

// Show current question
function showQuestion() {
  document.getElementById("question").textContent = flashcards[current].question;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
}

// Check the answer
function checkAnswer() {
  const userAnswer = document.getElementById("answer").value.trim();

  if (userAnswer.toLowerCase() === flashcards[current].answer.toLowerCase()) {
    score++;
    document.getElementById("feedback").textContent = "✅ Correct!";
  } else {
    document.getElementById("feedback").textContent = "❌ Wrong! The answer was " + flashcards[current].answer;
  }

  current++;
  if (current < flashcards.length) {
    setTimeout(showQuestion, 1500);
  } else {
    setTimeout(() => {
      document.getElementById("flashcardArea").innerHTML = `<h3>You scored ${score}/${flashcards.length}</h3>`;
    }, 1500);
  }
}

// Initialize list on page load
updateFlashcardList();
