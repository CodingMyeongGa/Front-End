import { useEffect, useRef, useState } from 'react'

export default function usePedometer({ useGenericSensor = true, debounceMs = 320 } = {}) {
  const [steps, setSteps] = useState(0)
  const lastStepAt = useRef(0)
  const g = useRef({ x:0, y:0, z:0 })
  const alpha = 0.9
  useEffect(() => {
    let sensor, onMotion
    const tick = (mag) => {
      const now = performance.now()
      if (mag < 1.2) return
      if (now - lastStepAt.current < debounceMs) return
      lastStepAt.current = now
      setSteps(s => s + 1)
    }
    const startDM = async () => {
      if (typeof DeviceMotionEvent?.requestPermission === 'function') {
        const p = await DeviceMotionEvent.requestPermission()
        if (p !== 'granted') return
      }
      onMotion = (e) => {
        const a = e.accelerationIncludingGravity || e.acceleration
        if (!a) return
        g.current.x = alpha*g.current.x + (1-alpha)*(a.x||0)
        g.current.y = alpha*g.current.y + (1-alpha)*(a.y||0)
        g.current.z = alpha*g.current.z + (1-alpha)*(a.z||0)
        const rx = (a.x||0)-g.current.x, ry = (a.y||0)-g.current.y, rz = (a.z||0)-g.current.z
        tick(Math.sqrt(rx*rx + ry*ry + rz*rz))
      }
      window.addEventListener('devicemotion', onMotion, { passive:true })
    }
    const startGS = async () => {
      try{
        const A = window.Accelerometer
        if (!A) return startDM()
        sensor = new A({ frequency: 50 })
        sensor.addEventListener('reading', () => {
          const { x=0, y=0, z=0 } = sensor
          g.current.x = alpha*g.current.x + (1-alpha)*x
          g.current.y = alpha*g.current.y + (1-alpha)*y
          g.current.z = alpha*g.current.z + (1-alpha)*z
          const rx = x-g.current.x, ry = y-g.current.y, rz = z-g.current.z
          tick(Math.sqrt(rx*rx + ry*ry + rz*rz))
        })
        sensor.start()
      }catch{ startDM() }
    }
    useGenericSensor ? startGS() : startDM()
    return () => {
      sensor?.stop?.()
      if (onMotion) window.removeEventListener('devicemotion', onMotion)
    }
  }, [useGenericSensor, debounceMs])
  return { steps, reset: () => setSteps(0) }
}