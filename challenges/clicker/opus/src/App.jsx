import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

const GAME_DURATION = 5
const COUNTDOWN_MESSAGES = ['Preparados', 'Listos', 'Ya']

function App() {
  const [count, setCount] = useState(0)
  const [maxScore, setMaxScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [phase, setPhase] = useState('idle') // idle | countdown | playing | finished
  const [countdownMessage, setCountdownMessage] = useState('')

  const timerRef = useRef(null)
  const countdownRef = useRef(null)

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (countdownRef.current) {
      clearTimeout(countdownRef.current)
      countdownRef.current = null
    }
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  const startGame = () => {
    setCount(0)
    setTimeLeft(GAME_DURATION)
    setPhase('countdown')

    let step = 0

    const showNext = () => {
      setCountdownMessage(COUNTDOWN_MESSAGES[step])

      if (step < COUNTDOWN_MESSAGES.length - 1) {
        step++
        countdownRef.current = setTimeout(showNext, 1000)
      } else {
        countdownRef.current = setTimeout(() => {
          setCountdownMessage('')
          setPhase('playing')

          const startTime = Date.now()
          timerRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000
            const remaining = Math.max(0, GAME_DURATION - elapsed)
            setTimeLeft(Math.ceil(remaining))

            if (remaining <= 0) {
              clearInterval(timerRef.current)
              timerRef.current = null
              setPhase('finished')
            }
          }, 100)
        }, 1000)
      }
    }

    showNext()
  }

  useEffect(() => {
    if (phase === 'finished') {
      setMaxScore((prev) => Math.max(prev, count))
    }
  }, [phase, count])

  const handleClick = () => {
    setCount((prev) => prev + 1)
  }

  const isPlaying = phase === 'playing'
  const isIdle = phase === 'idle' || phase === 'finished'

  return (
    <div className="app">
      <h1 className="title">Juego Clicker</h1>

      <div className="scoreboard">
        <div className="score-item">
          <span className="score-label">Puntaje máximo</span>
          <span className="score-value max">{maxScore}</span>
        </div>
        <div className="score-item">
          <span className="score-label">Puntaje actual</span>
          <span className="score-value current">{count}</span>
        </div>
      </div>

      {phase === 'countdown' && (
        <div className="countdown">{countdownMessage}</div>
      )}

      {isPlaying && (
        <div className="timer">Tiempo restante: {timeLeft}s</div>
      )}

      {phase === 'finished' && (
        <div className="result">
          {count > 0 && count >= maxScore
            ? `¡Nuevo récord! ${count} clicks`
            : `Tiempo terminado. ${count} clicks`}
        </div>
      )}

      <div className="buttons">
        <button
          className="btn btn-start"
          onClick={startGame}
          disabled={!isIdle}
        >
          Iniciar
        </button>
        <button
          className="btn btn-click"
          onClick={handleClick}
          disabled={!isPlaying}
        >
          ¡Click!
        </button>
      </div>
    </div>
  )
}

export default App
