# Juego Clicker

<details>
<summary>Prompt</summary>

En la carpeta opus, quiero que desarrolles un minijuego con react. El juego se trata de clickear un boton para lograr la maxima puntuacion posible. Debe de haber 2 botones, uno para clickear y otro para dar inicio al juego.
Al presionar el botón de inicio, dicho botón debe deshabilitarse y el componente debe mostrar una 
cuenta regresiva visual con los mensajes "Preparados", "Listos" y "Ya" en intervalos de 1 segundo. 
Al mostrarse el "Ya", el botón para clickear debe habilitarse durante 5 segundos, permitiendo al usuario 
clickear tantas veces como desee. El usuario debe poder ver durante el juego el tiempo restante 
disponible para clickear el botón y el contador actual. 
Concluido el tiempo, el botón para clickear debe deshabilitarse, el botón para iniciar debe habilitarse 
nuevamente 
y, en caso de que se haya superado el puntaje máximo, el valor mostrado debe cambiar por el actual.

</details>

<details>
<summary>Respuesta</summary>

El proyecto está creado en `challenges/clicker/opus/` con la siguiente estructura:

- `package.json` — dependencias (React 19 + Vite)
- `src/App.jsx` — lógica del juego
- `src/App.css` — estilos
- `src/main.jsx` — punto de entrada
- `src/index.css` — estilos globales
- `index.html` — HTML base

**Funcionamiento del juego:**

1. **Botón "Iniciar"** — arranca el juego y se deshabilita
2. **Cuenta regresiva** — muestra "Preparados" → "Listos" → "Ya" con intervalos de 1 segundo y animación de pulso
3. **Fase de juego** — al llegar a "Ya", el botón "¡Click!" se habilita por 5 segundos con un temporizador visible
4. **Fin** — el botón de click se deshabilita, el de inicio se habilita, y si se superó el récord se actualiza el puntaje máximo

Para ejecutarlo:
```
cd challenges/clicker/opus
npm install
npm run dev
```

</details>
