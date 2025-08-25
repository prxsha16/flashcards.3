// ========== State ==========
let flashcards = JSON.parse(localStorage.getItem("flashcards") || "[]");
let currentCard = null;

// ========== Elements (robust to naming) ==========
const qInput = document.getElementById("questionInput") || document.getElementById("question");
const aInput = document.getElementById("answerInput") || document.getElementById("answer");
const addBtn = document.getElementById("addFlashcardBtn"); // optional; you might be using onclick on the button

const listEl = document.getElementById("flashcardList");

const quizArea = document.getElementById("flashcardArea");
const quizQuestionEl = document.getElementById("flashcardQuestion") || document.getElementById("flashcard");
const userAnswerEl = document.getElementById("userAnswerInput");
const feedbackEl = document.getElementById("feedback");

// ========== Helpers ==========
function save() {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

function show(el) {
  if (!el) return;
  el.style.display = "block";
}

function hide(el) {
  if (!el) return;
  el.style.display = "none";
}

// ========== CRUD ==========
function addFlashcard() {
  const q = (qInput?.value || "").trim();
  const a = (aInput?.value || "").trim();
  if (!q || !a) {
    alert("Please enter both a question and an answer.");
    return;
  }

  flashcards.push({ question: q, answer: a });
  save();

  if (qInput) qInput.value = "";
  if (aInput) aInput.value = "";

  renderList();

  // If we weren't already quizzing, start right away
  if (quizArea && quizArea.style.display !== "block") {
    startQuiz();
  }
}

function deleteFlashcard(index) {
  flashcards.splice(index, 1);
  save();
  renderList();

  // If you delete everything, exit quiz mode
  if (flashcards.length === 0) {
    hide(quizArea);
    show(listEl);
  }
}

function renderList() {
  if (!listEl) return;
  listEl.innerHTML = "";

  flashcards.forEach((card, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>Q:</strong> ${card.question} &nbsp; | &nbsp; <strong>A:</strong> ${card.answer}</span>
      <button class="delete-btn" type="button">Delete</button>
    `;
    li.querySelector("button").addEventListener("click", () => deleteFlashcard(i));
    listEl.appendChild(li);
  });
}

// ========== Quiz flow ==========
function startQuiz() {
  if (flashcards.length === 0) {
    alert("No flashcards yet — add some first.");
    return;
  }
  // Hide the saved list while quizzing
  hide(listEl);
  show(quizArea);
  nextQuestion();
}

function nextQuestion() {
  if (flashcards.length === 0) {
    hide(quizArea);
    show(listEl);
    return;
  }
  currentCard = flashcards[Math.floor(Math.random() * flashcards.length)];
  if (quizQuestionEl) quizQuestionEl.textContent = currentCard.question;
  if (feedbackEl) feedbackEl.textContent = "";
  if (userAnswerEl) userAnswerEl.value = "";
  if (userAnswerEl) userAnswerEl.focus();
}

function checkAnswer() {
  if (!currentCard) return;
  const userAns = (userAnswerEl?.value || "").trim().toLowerCase();
  const correct = (currentCard.answer || "").trim().toLowerCase();

  if (feedbackEl) {
    if (userAns === correct) {
      feedbackEl.textContent = "✅ Correct!";
      feedbackEl.style.color = "lightgreen";
    } else {
      feedbackEl.textContent = `❌ Wrong! Correct answer: ${currentCard.answer}`;
      feedbackEl.style.color = "red";
    }
  }

  // After 2s, return to the list (as you requested)
  setTimeout(() => {
    show(listEl);
    hide(quizArea);
  }, 2000);
}

// ========== Wiring & Startup ==========
function onEnter(el, handler) {
  if (!el) return;
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handler();
  });
}

// If there's an explicit Add button without inline onclick, wire it:
if (addBtn) addBtn.addEventListener("click", addFlashcard);

// Enter to add from either field:
onEnter(qInput, addFlashcard);
onEnter(aInput, addFlashcard);

// Enter to submit answer:
onEnter(userAnswerEl, checkAnswer);

// Initial render:
renderList();

// Auto-start quiz if there are already cards (since your app "goes straight into it")
if (flashcards.length > 0 && quizArea) {
  startQuiz();
}

// Expose functions if your HTML uses inline onclick=""
window.addFlashcard = addFlashcard;
window.checkAnswer = checkAnswer;
window.startQuiz = startQuiz; // harmless if you don't have a Start button
