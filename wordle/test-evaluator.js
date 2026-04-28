function evaluateGuess(guess, target) {
  const result = Array(5).fill("absent");
  const targetChars = target.split("");

  for (let i = 0; i < 5; i += 1) {
    if (guess[i] === targetChars[i]) {
      result[i] = "exact";
      targetChars[i] = null;
    }
  }

  for (let i = 0; i < 5; i += 1) {
    if (result[i] !== "absent") {
      continue;
    }

    const found = targetChars.indexOf(guess[i]);
    if (found !== -1) {
      result[i] = "present";
      targetChars[found] = null;
    }
  }

  return result;
}

function assertEqual(actual, expected, testName) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    console.error("FAIL:", testName, "\n actual:  ", actual, "\n expected:", expected);
    process.exitCode = 1;
    return;
  }

  console.log("OK:", testName);
}

assertEqual(
  evaluateGuess("carta", "carta"),
  ["exact", "exact", "exact", "exact", "exact"],
  "todo exacto"
);

assertEqual(
  evaluateGuess("torre", "trapo"),
  ["exact", "present", "present", "absent", "absent"],
  "mezcla con ausentes"
);

assertEqual(
  evaluateGuess("salsa", "salon"),
  ["exact", "exact", "exact", "absent", "absent"],
  "letras repetidas"
);

if (!process.exitCode) {
  console.log("Todos los tests pasaron.");
}

