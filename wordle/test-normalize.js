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
    .slice(0, 5);
}

function assertEqual(actual, expected, testName) {
  if (actual !== expected) {
    console.error("FAIL:", testName, "| actual:", actual, "| expected:", expected);
    process.exitCode = 1;
    return;
  }

  console.log("OK:", testName);
}

assertEqual(normalizeWord("AÑo  "), "año", "conserva enie");
assertEqual(normalizeWord("camión"), "camio", "normaliza tilde y limita a 5");
assertEqual(normalizeWord("niñez"), "niñez", "admite enie dentro de palabra");

if (!process.exitCode) {
  console.log("Todos los tests de normalizacion pasaron.");
}

