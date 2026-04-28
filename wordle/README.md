# Wordle (mini)

Juego tipo Wordle en espanol con JavaScript vanilla.

Notas:
- Las vocales con tilde se normalizan (por ejemplo, `camión` pasa a `camion`).
- La letra `ñ` se conserva y es valida en los intentos (por ejemplo, `año`).
- El input es libre: se aceptan palabras válidas de 5 letras aunque no aparezcan en `palabras.txt`.

## Archivos

- `index.html`: interfaz del juego.
- `styles.css`: estilos del tablero y formulario.
- `main.js`: logica del juego.
- `palabras.txt`: diccionario de palabras de 5 letras.
- `test-evaluator.js`: mini prueba de la logica de evaluacion.

## Ejecutar en local

Sirve la carpeta raíz del repo con un servidor local para que `fetch("palabras.txt")` funcione:

```bash
cd /home/victor/Web/github-page/victorsur.github.io
python3 -m http.server 8080
```

Abre `http://localhost:8080/wordle/index.html`.

## Probar la logica

```bash
cd /home/victor/Web/github-page/victorsur.github.io/wordle
node test-evaluator.js
node test-normalize.js
```

