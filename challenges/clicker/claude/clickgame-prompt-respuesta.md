# Click Frenzy — Prompt & Respuesta

<details>
<summary>📝 Prompt</summary>

> en una carpeta llamada claude, quiero que desarrolles un minijuego con react. El juego se trata de clickear un boton para lograr la maxima puntuacion posible. Debe de haber 2 botones, uno para clickear y otro para dar inicio al juego. Al presionar el botón de inicio, dicho botón debe deshabilitarse y el componente debe mostrar una cuenta regresiva visual con los mensajes "Preparados", "Listos" y "Ya" en intervalos de 1 segundo. Al mostrarse el "Ya", el botón para clickear debe habilitarse durante 5 segundos, permitiendo al usuario clickear tantas veces como desee. El usuario debe poder ver durante el juego el tiempo restante disponible para clickear el botón y el contador actual. Concluido el tiempo, el botón para clickear debe deshabilitarse, el botón para iniciar debe habilitarse nuevamente y, en caso de que se haya superado el puntaje máximo, el valor mostrado debe cambiar por el actual.

</details>

---

<details>
<summary>💬 Respuesta</summary>

Se generó el componente `ClickGame.jsx` dentro de la carpeta `claude`. A continuación el detalle de lo implementado:

### Flujo del juego

- **INICIO** lanza la cuenta regresiva: *Preparados → Listos → Ya* (1 segundo por mensaje), con animación pop-in en cada uno.
- Al aparecer *"Ya"*, el botón de click se habilita por **5 segundos exactos**.
- Una barra de progreso con color dinámico (verde → amarillo → rojo) muestra el tiempo restante en tiempo real.
- Al terminar, se deshabilita el botón de click, se habilita el de inicio y, si hubo récord, aparece un ★ dorado junto al puntaje máximo.

### Estética

Arcade cyberpunk oscuro — tipografía *Black Ops One* + *Rajdhani*, paleta neón verde sobre negro profundo, cuadrícula ambiental, botón circular con glow pulsante mientras el juego está activo.

### Código generado

```jsx
import { useState, useEffect, useRef, useCallback } from "react";

const COUNTDOWN_MESSAGES = ["Preparados", "Listos", "Ya"];
const GAME_DURATION = 5;

export default function ClickGame() {
  const [phase, setPhase] = useState("idle"); // idle | countdown | playing | finished
  const [countdownIndex, setCountdownIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [newRecord, setNewRecord] = useState(false);
  const [clickEffect, setClickEffect] = useState(false);

  const countdownRef = useRef(null);
  const gameTimerRef = useRef(null);

  const clearTimers = () => {
    clearInterval(countdownRef.current);
    clearInterval(gameTimerRef.current);
  };

  const startGame = () => {
    clearTimers();
    setPhase("countdown");
    setCountdownIndex(0);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setNewRecord(false);

    let step = 0;
    countdownRef.current = setInterval(() => {
      step++;
      if (step < COUNTDOWN_MESSAGES.length) {
        setCountdownIndex(step);
      } else {
        clearInterval(countdownRef.current);
        setPhase("playing");

        let remaining = GAME_DURATION;
        gameTimerRef.current = setInterval(() => {
          remaining--;
          setTimeLeft(remaining);
          if (remaining <= 0) {
            clearInterval(gameTimerRef.current);
            setPhase("finished");
          }
        }, 1000);
      }
    }, 1000);
  };

  const handleClick = useCallback(() => {
    if (phase !== "playing") return;
    setScore((prev) => prev + 1);
    setClickEffect((v) => !v);
  }, [phase]);

  useEffect(() => {
    if (phase === "finished") {
      setMaxScore((prev) => {
        if (score > prev) {
          setNewRecord(true);
          return score;
        }
        return prev;
      });
    }
  }, [phase]);

  useEffect(() => () => clearTimers(), []);

  const isIdle = phase === "idle";
  const isCountdown = phase === "countdown";
  const isPlaying = phase === "playing";
  const isFinished = phase === "finished";

  const timerRatio = timeLeft / GAME_DURATION;
  const timerColor =
    timeLeft > 3 ? "#00ff9d" : timeLeft > 1 ? "#ffd700" : "#ff4444";

  return (
    <div style={styles.root}>
      <div style={styles.grid} />
      <div style={styles.card}>
        <div style={styles.titleRow}>
          <span style={styles.titleAccent}>CLICK</span>
          <span style={styles.titleMain}>FRENZY</span>
        </div>
        <div style={styles.scorePanel}>
          <div style={styles.scoreBox}>
            <span style={styles.scoreLabel}>PUNTOS</span>
            <span style={{ ...styles.scoreValue, color: isPlaying ? "#00ff9d" : "#e0e0e0" }}>
              {score}
            </span>
          </div>
          <div style={styles.divider} />
          <div style={styles.scoreBox}>
            <span style={styles.scoreLabel}>MÁXIMO</span>
            <span style={{ ...styles.scoreValue, color: newRecord ? "#ffd700" : "#e0e0e0" }}>
              {maxScore}
              {newRecord && <span style={styles.crownIcon}> ★</span>}
            </span>
          </div>
        </div>
        <div style={styles.timerContainer}>
          <div
            style={{
              ...styles.timerBar,
              width: isPlaying ? `${timerRatio * 100}%` : isIdle || isFinished ? "0%" : "100%",
              backgroundColor: timerColor,
              transition: isPlaying ? "width 1s linear, background-color 0.3s" : "none",
            }}
          />
          {isPlaying && (
            <span style={{ ...styles.timerText, color: timerColor }}>{timeLeft}s</span>
          )}
        </div>
        <div style={styles.stage}>
          {(isIdle || isFinished) && (
            <div style={styles.statusArea}>
              {isFinished ? (
                <div style={styles.resultBox}>
                  <span style={styles.resultLabel}>
                    {newRecord ? "¡NUEVO RÉCORD!" : "¡TIEMPO!"}
                  </span>
                  <span style={styles.resultScore}>{score}</span>
                  <span style={styles.resultSub}>clicks</span>
                </div>
              ) : (
                <div style={styles.idleHint}>
                  Presioná <span style={styles.hintAccent}>INICIO</span> para jugar
                </div>
              )}
            </div>
          )}
          {isCountdown && (
            <div style={styles.countdownBox} key={countdownIndex}>
              <span style={styles.countdownText}>
                {COUNTDOWN_MESSAGES[countdownIndex]}
              </span>
            </div>
          )}
          <button
            onClick={handleClick}
            disabled={!isPlaying}
            style={{
              ...styles.clickBtn,
              ...(isPlaying ? styles.clickBtnActive : styles.clickBtnDisabled),
            }}
          >
            <span style={styles.clickBtnLabel}>{isPlaying ? "¡CLICK!" : "×"}</span>
            {isPlaying && <span style={styles.clickBtnGlow} key={String(clickEffect)} />}
          </button>
        </div>
        <button
          onClick={startGame}
          disabled={isCountdown || isPlaying}
          style={{
            ...styles.startBtn,
            ...(isCountdown || isPlaying ? styles.startBtnDisabled : styles.startBtnEnabled),
          }}
        >
          {isCountdown || isPlaying ? "EN CURSO..." : isFinished ? "JUGAR DE NUEVO" : "INICIO"}
        </button>
      </div>
    </div>
  );
}
```

</details>
