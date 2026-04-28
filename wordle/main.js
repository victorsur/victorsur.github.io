const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

let words = [];
let secretWord = "";
let attempts = [];
let gameFinished = false;

const board = document.getElementById("board");
const form = document.getElementById("guessForm");
const input = document.getElementById("guessInput");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const statusMessage = document.getElementById("statusMessage");
const attemptInfo = document.getElementById("attemptInfo");

function normalizeWord(raw) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/[^a-zñ]/g, "")
    .slice(0, WORD_LENGTH);
}

function createEmptyBoard() {
  board.innerHTML = "";

  for (let row = 0; row < MAX_ATTEMPTS; row += 1) {
    const rowNode = document.createElement("div");
    rowNode.className = "board-row";

    for (let col = 0; col < WORD_LENGTH; col += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      rowNode.appendChild(cell);
    }

    board.appendChild(rowNode);
  }
}

function evaluateGuess(guess, target) {
  const result = Array(WORD_LENGTH).fill("absent");
  const targetChars = target.split("");

  // Primera pasada: letras correctas en posicion exacta.
  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (guess[i] === targetChars[i]) {
      result[i] = "exact";
      targetChars[i] = null;
    }
  }

  // Segunda pasada: letras presentes en otra posicion.
  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (result[i] !== "absent") {
      continue;
    }

    const foundIndex = targetChars.indexOf(guess[i]);
    if (foundIndex !== -1) {
      result[i] = "present";
      targetChars[foundIndex] = null;
    }
  }

  return result;
}

function renderAttempt(rowIndex, guess, marks) {
  const row = board.children[rowIndex];
  if (!row) {
    return;
  }

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    const cell = row.children[i];
    cell.textContent = guess[i].toUpperCase();
    cell.classList.add(marks[i]);
  }
}

function setStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.classList.remove("win", "lose");
  if (type) {
    statusMessage.classList.add(type);
  }
}

function updateAttemptInfo() {
  const next = Math.min(attempts.length + 1, MAX_ATTEMPTS);
  attemptInfo.textContent = "Intento " + next + " de " + MAX_ATTEMPTS;
}

function lockGame() {
  gameFinished = true;
  input.disabled = true;
  submitBtn.disabled = true;
  resetBtn.disabled = false;
}

function validateGuess(guess) {
  if (gameFinished) {
    return "La partida ya ha terminado. Pulsa Nueva palabra.";
  }

  if (!/^[a-zñ]{5}$/.test(guess)) {
    return "Debes escribir exactamente 5 letras.";
  }

  return "";
}

function submitGuess(event) {
  event.preventDefault();

  const guess = normalizeWord(input.value.trim());
  const validationError = validateGuess(guess);

  if (validationError) {
    setStatus(validationError);
    return;
  }

  const marks = evaluateGuess(guess, secretWord);
  renderAttempt(attempts.length, guess, marks);
  attempts.push(guess);
  input.value = "";

  if (guess === secretWord) {
    lockGame();
    setStatus("Enhorabuena! Acertaste en " + attempts.length + " intento(s).", "win");
    updateAttemptInfo();
    return;
  }

  if (attempts.length >= MAX_ATTEMPTS) {
    lockGame();
    setStatus("Has perdido. La palabra era: " + secretWord.toUpperCase() + ".", "lose");
    attemptInfo.textContent = "Intentos usados: " + MAX_ATTEMPTS + " de " + MAX_ATTEMPTS;
    return;
  }

  updateAttemptInfo();
  setStatus("Sigue probando...");
}

function pickRandomWord() {
  const index = Math.floor(Math.random() * words.length);
  return words[index];
}

function startNewGame() {
  if (!words.length) {
    setStatus("No hay palabras cargadas.", "lose");
    return;
  }

  secretWord = pickRandomWord();
  attempts = [];
  gameFinished = false;

  createEmptyBoard();
  updateAttemptInfo();
  setStatus("Palabra cargada. Empieza el juego.");

  input.disabled = false;
  submitBtn.disabled = false;
  resetBtn.disabled = false;
  input.focus();
}

async function loadWords() {
  try {
    const response = await fetch("palabras.txt", { cache: "no-store" });
    if (!response.ok) {
      setStatus("No se pudo leer palabras.txt.", "lose");
      attemptInfo.textContent = "";
      return;
    }

    const text = await response.text();
    const parsedWords = text
      .split(/\r?\n/)
      .map((line) => normalizeWord(line))
      .filter((word) => word.length === WORD_LENGTH);

    words = Array.from(new Set(parsedWords));

    if (words.length < 50) {
      setStatus("La lista de palabras es demasiado pequena.", "lose");
      attemptInfo.textContent = "";
      return;
    }

    startNewGame();
  } catch (error) {
    setStatus("Error cargando palabras. Usa un servidor local para ejecutar el juego.", "lose");
    attemptInfo.textContent = "";
    console.error(error);
  }
}

form.addEventListener("submit", submitGuess);
resetBtn.addEventListener("click", startNewGame);

createEmptyBoard();
loadWords();
