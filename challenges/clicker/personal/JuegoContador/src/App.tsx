import { useState, useRef, useEffect } from 'react'
import './App.css'

const DURATION = 5
const STEPS = ['Preparados', 'Listos', 'Ya']

function App() {
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [phase, setPhase] = useState<'idle' | 'countdown' | 'playing' | 'done'>('idle')
  const [step, setStep] = useState(0)

  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (phase === 'done') {
      setBest(prev => Math.max(prev, score))
    }
  }, [phase, score])

  function startGame() {
    setScore(0)
    setTimeLeft(DURATION)
    setStep(0)
    setPhase('countdown')

    let i = 0
    const next = () => {
      setStep(i)
      if (i < STEPS.length - 1) {
        i++
        countdownRef.current = setTimeout(next, 1000)
      } else {
        countdownRef.current = setTimeout(() => {
          setPhase('playing')
          const start = Date.now()
          intervalRef.current = setInterval(() => {
            const remaining = DURATION - Math.floor((Date.now() - start) / 1000)
            if (remaining <= 0) {
              clearInterval(intervalRef.current!)
              setTimeLeft(0)
              setPhase('done')
            } else {
              setTimeLeft(remaining)
            }
          }, 100)
        }, 1000)
      }
    }
    next()
  }

  const isIdle = phase === 'idle' || phase === 'done'
  const isPlaying = phase === 'playing'

  return (
    <div id="game">
      <h1>Juego Clicker</h1>

      <p>Puntaje: {score}</p>
      <p>Máximo: {best}</p>

      {phase === 'countdown' && <p>{STEPS[step]}</p>}
      {isPlaying && <p>Tiempo restante: {timeLeft}s</p>}
      {phase === 'done' && <p>{score >= best && score > 0 ? 'Nuevo record' : 'Tiempo terminado'}</p>}

      <div id="buttons">
        <button onClick={startGame} disabled={!isIdle}>Iniciar</button>
        <button onClick={() => setScore(s => s + 1)} disabled={!isPlaying}>Click</button>
      </div>
    </div>
  )
}

export default App
