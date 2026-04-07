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
      {/* Background grid */}
      <div style={styles.grid} />

      <div style={styles.card}>
        {/* Title */}
        <div style={styles.titleRow}>
          <span style={styles.titleAccent}>CLICK</span>
          <span style={styles.titleMain}>FRENZY</span>
        </div>

        {/* Score Panel */}
        <div style={styles.scorePanel}>
          <div style={styles.scoreBox}>
            <span style={styles.scoreLabel}>PUNTOS</span>
            <span
              style={{
                ...styles.scoreValue,
                color: isPlaying ? "#00ff9d" : "#e0e0e0",
              }}
            >
              {score}
            </span>
          </div>
          <div style={styles.divider} />
          <div style={styles.scoreBox}>
            <span style={styles.scoreLabel}>MÁXIMO</span>
            <span
              style={{
                ...styles.scoreValue,
                color: newRecord ? "#ffd700" : "#e0e0e0",
              }}
            >
              {maxScore}
              {newRecord && <span style={styles.crownIcon}> ★</span>}
            </span>
          </div>
        </div>

        {/* Timer Bar */}
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
            <span style={{ ...styles.timerText, color: timerColor }}>
              {timeLeft}s
            </span>
          )}
        </div>

        {/* Center Stage */}
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

          {/* Click Button */}
          <button
            onClick={handleClick}
            disabled={!isPlaying}
            style={{
              ...styles.clickBtn,
              ...(isPlaying ? styles.clickBtnActive : styles.clickBtnDisabled),
            }}
          >
            <span style={styles.clickBtnLabel}>
              {isPlaying ? "¡CLICK!" : "×"}
            </span>
            {isPlaying && (
              <span style={styles.clickBtnGlow} key={String(clickEffect)} />
            )}
          </button>
        </div>

        {/* Start Button */}
        <button
          onClick={startGame}
          disabled={isCountdown || isPlaying}
          style={{
            ...styles.startBtn,
            ...(isCountdown || isPlaying
              ? styles.startBtnDisabled
              : styles.startBtnEnabled),
          }}
        >
          {isCountdown || isPlaying ? "EN CURSO..." : isFinished ? "JUGAR DE NUEVO" : "INICIO"}
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Rajdhani:wght@400;600;700&display=swap');

        @keyframes popIn {
          0% { transform: scale(0.4); opacity: 0; }
          70% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 24px #00ff9d55, inset 0 0 12px #00ff9d22; }
          50% { box-shadow: 0 0 48px #00ff9daa, inset 0 0 24px #00ff9d44; }
        }
        @keyframes ripple {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    backgroundColor: "#0a0a12",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Rajdhani', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,255,157,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,157,0.04) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  card: {
    width: 380,
    backgroundColor: "#12121e",
    border: "1px solid rgba(0,255,157,0.2)",
    borderRadius: 4,
    padding: "32px 28px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    boxShadow: "0 0 60px rgba(0,255,157,0.06), 0 0 120px rgba(0,0,0,0.8)",
    position: "relative",
    zIndex: 1,
  },
  titleRow: {
    textAlign: "center",
    lineHeight: 1,
  },
  titleAccent: {
    fontFamily: "'Black Ops One', cursive",
    fontSize: 36,
    color: "#00ff9d",
    letterSpacing: 4,
    marginRight: 8,
    textShadow: "0 0 20px #00ff9d88",
  },
  titleMain: {
    fontFamily: "'Black Ops One', cursive",
    fontSize: 36,
    color: "#e0e0e0",
    letterSpacing: 4,
  },
  scorePanel: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#0d0d18",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 4,
    padding: "12px 20px",
  },
  scoreBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    margin: "0 12px",
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 3,
    color: "#555",
    textTransform: "uppercase",
  },
  scoreValue: {
    fontFamily: "'Black Ops One', cursive",
    fontSize: 36,
    lineHeight: 1,
    transition: "color 0.3s",
  },
  crownIcon: {
    color: "#ffd700",
    fontSize: 24,
    textShadow: "0 0 12px #ffd700aa",
  },
  timerContainer: {
    height: 6,
    backgroundColor: "#1a1a28",
    borderRadius: 3,
    overflow: "hidden",
    position: "relative",
  },
  timerBar: {
    height: "100%",
    borderRadius: 3,
  },
  timerText: {
    position: "absolute",
    right: 0,
    top: -18,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
  },
  stage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    minHeight: 180,
    justifyContent: "center",
  },
  statusArea: {
    textAlign: "center",
    minHeight: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  resultBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    animation: "popIn 0.4s ease forwards",
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 3,
    color: "#ffd700",
    textShadow: "0 0 12px #ffd70088",
  },
  resultScore: {
    fontFamily: "'Black Ops One', cursive",
    fontSize: 56,
    color: "#e0e0e0",
    lineHeight: 1,
  },
  resultSub: {
    fontSize: 13,
    color: "#555",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  idleHint: {
    fontSize: 15,
    color: "#444",
    letterSpacing: 1,
  },
  hintAccent: {
    color: "#00ff9d",
    fontWeight: 700,
  },
  countdownBox: {
    animation: "popIn 0.35s cubic-bezier(.34,1.56,.64,1) forwards",
    minHeight: 70,
    display: "flex",
    alignItems: "center",
  },
  countdownText: {
    fontFamily: "'Black Ops One', cursive",
    fontSize: 44,
    color: "#00ff9d",
    textShadow: "0 0 30px #00ff9d",
    letterSpacing: 2,
  },
  clickBtn: {
    width: 130,
    height: 130,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    position: "relative",
    transition: "transform 0.08s, opacity 0.3s",
    outline: "none",
    overflow: "hidden",
  },
  clickBtnActive: {
    backgroundColor: "#00ff9d",
    boxShadow: "0 0 24px #00ff9d55, inset 0 0 12px #00ff9d22",
    animation: "pulseGlow 1.5s ease-in-out infinite",
    cursor: "pointer",
    transform: "scale(1)",
  },
  clickBtnDisabled: {
    backgroundColor: "#1a1a28",
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: 0.4,
  },
  clickBtnLabel: {
    fontFamily: "'Black Ops One', cursive",
    fontSize: 22,
    color: "#0a0a12",
    letterSpacing: 1,
    position: "relative",
    zIndex: 1,
  },
  clickBtnGlow: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.35)",
    animation: "ripple 0.4s ease-out forwards",
    pointerEvents: "none",
  },
  startBtn: {
    width: "100%",
    padding: "14px 0",
    border: "none",
    borderRadius: 4,
    fontSize: 15,
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 700,
    letterSpacing: 3,
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.1s",
    outline: "none",
  },
  startBtnEnabled: {
    backgroundColor: "#00ff9d",
    color: "#0a0a12",
    boxShadow: "0 0 20px #00ff9d44",
  },
  startBtnDisabled: {
    backgroundColor: "#1a1a28",
    color: "#333",
    cursor: "not-allowed",
    border: "1px solid rgba(255,255,255,0.06)",
  },
};
