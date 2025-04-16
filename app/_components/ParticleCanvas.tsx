"use client"

import {useEffect, useRef} from "react"

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    baseRadius: number
    color: string
    glowColor: string
    pulseSpeed: number
    pulsePhase: number
    targetX: number | null
    targetY: number | null
    targetTimer: number
    pixelated: boolean
    connections: number
}

interface BackgroundParticle {
    x: number
    y: number
    size: number
    speed: number
    opacity: number
}

interface Connection {
    p1: Particle
    p2: Particle
    distance: number
    alpha: number
    splitting: boolean
    splitProgress: number
    splitPoint: { x: number; y: number }
    energyBurst: boolean
    burstProgress: number
    burstColor: string
}

export default function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const bgCanvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const bgParticlesRef = useRef<BackgroundParticle[]>([])
    const connectionsRef = useRef<Connection[]>([])
    const animationRef = useRef<number>(0)
    const bgAnimationRef = useRef<number>(0)
    const mouseRef = useRef<{ x: number | null; y: number | null }>({x: null, y: null})
    const noiseOffsetRef = useRef<number>(0)

    useEffect(() => {
        const bgCanvas = bgCanvasRef.current
        if (!bgCanvas) return

        const bgCtx = bgCanvas.getContext("2d")
        if (!bgCtx) return

        const resizeCanvas = () => {
            bgCanvas.width = window.innerWidth
            bgCanvas.height = window.innerHeight
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Create background particles
        const createBackgroundParticles = () => {
            const particles: BackgroundParticle[] = []
            // More background particles for texture
            const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 8000)

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * bgCanvas.width,
                    y: Math.random() * bgCanvas.height,
                    size: Math.random() * 1.5 + 0.5,
                    speed: Math.random() * 0.2 + 0.1,
                    opacity: Math.random() * 0.5 + 2,
                })
            }

            bgParticlesRef.current = particles
        }

        createBackgroundParticles()

        // Perlin noise function (simplified)
        const noise = (x: number, y: number) => {
            const X = Math.floor(x) & 255
            const Y = Math.floor(y) & 255
            return (Math.sin(X * 0.1 + Y * 0.1) * 0.5 + 0.5) * (Math.cos(X * 0.1) * 0.5 + 0.5)
        }

        // Create noise texture
        const createNoiseTexture = () => {
            const noiseCanvas = document.createElement("canvas")
            noiseCanvas.width = bgCanvas.width
            noiseCanvas.height = bgCanvas.height
            const noiseCtx = noiseCanvas.getContext("2d")
            if (!noiseCtx) return null

            const imageData = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height)
            const data = imageData.data

            for (let y = 0; y < noiseCanvas.height; y++) {
                for (let x = 0; x < noiseCanvas.width; x++) {
                    // Generate noise value
                    const value = Math.random() * 50
                    const index = (y * noiseCanvas.width + x) * 4

                    // Set RGBA values
                    data[index] = data[index + 1] = data[index + 2] = value
                    data[index + 3] = 10 // Low alpha for subtle effect
                }
            }

            noiseCtx.putImageData(imageData, 0, 0)
            return noiseCanvas
        }

        const noiseTexture = createNoiseTexture()

        // Background animation loop
        const animateBg = () => {
            bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height)

            // Draw background gradient
            const gradient = bgCtx.createLinearGradient(0, 0, 0, bgCanvas.height)
            gradient.addColorStop(0, "#0f172a") // Dark blue
            gradient.addColorStop(1, "#0c4a6e") // Darker blue
            bgCtx.fillStyle = gradient
            bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height)

            // Apply noise texture
            if (noiseTexture) {
                bgCtx.globalAlpha = 0.15
                bgCtx.drawImage(noiseTexture, 0, 0)
                bgCtx.globalAlpha = 1.0
            }

            // Draw hexagonal grid pattern
            const hexSize = 60
            const time = performance.now() / 1500
            noiseOffsetRef.current += 0.5

            bgCtx.strokeStyle = "rgba(30, 58, 138, 0.9)" // Very subtle blue
            bgCtx.lineWidth = 0.5

            // Draw hexagonal grid
            const height = hexSize * Math.sqrt(3)
            for (let row = -1; row < bgCanvas.height / height + 1; row++) {
                for (let col = -1; col < bgCanvas.width / hexSize + 1; col++) {
                    const centerX = col * hexSize * 1.5
                    const centerY = row * height + (col % 2 === 0 ? 0 : height / 2)

                    // Add subtle movement to the grid
                    const offsetX = Math.sin(time + row * 0.2 + col * 0.3) * 5
                    const offsetY = Math.cos(time + row * 0.3 + col * 0.2) * 5

                    bgCtx.beginPath()
                    for (let i = 0; i < 6; i++) {
                        const angle = ((2 * Math.PI) / 6) * i
                        const x = centerX + offsetX + hexSize * Math.cos(angle)
                        const y = centerY + offsetY + hexSize * Math.sin(angle)

                        if (i === 0) {
                            bgCtx.moveTo(x, y)
                        } else {
                            bgCtx.lineTo(x, y)
                        }
                    }
                    bgCtx.closePath()
                    bgCtx.stroke()

                    // Occasionally fill some hexagons for more texture
                    if (Math.random() < 0.0001) {
                        bgCtx.fillStyle = "rgba(30, 58, 38, 0.9)"
                        bgCtx.fill()
                    }
                }
            }

            // Draw circuit-like lines for tech feel
            bgCtx.strokeStyle = "rgba(56, 189, 248, 0.07)" // Light blue
            bgCtx.lineWidth = 0.8

            const lineCount = 10
            for (let i = 0; i < lineCount; i++) {
                const startX = Math.random() * bgCanvas.width
                const startY = Math.random() * bgCanvas.height

                bgCtx.beginPath()
                bgCtx.moveTo(startX, startY)

                let x = startX
                let y = startY
                const segments = 3 + Math.floor(Math.random() * 4)

                for (let j = 0; j < segments; j++) {
                    // Only horizontal or vertical movements for circuit-like appearance
                    if (Math.random() > 0.5) {
                        x += (Math.random() - 0.5) * bgCanvas.width * 0.3
                    } else {
                        y += (Math.random() - 0.5) * bgCanvas.height * 0.3
                    }

                    bgCtx.lineTo(x, y)
                }

                bgCtx.stroke()
            }

            // Draw floating dust particles
            const bgParticles = bgParticlesRef.current

            for (let i = 0; i < bgParticles.length; i++) {
                const p = bgParticles[i]

                // Move particle upward slowly
                p.y -= p.speed

                // Wrap around when reaching the top
                if (p.y < -10) {
                    p.y = bgCanvas.height + 10
                    p.x = Math.random() * bgCanvas.width
                }

                // Add slight horizontal drift
                p.x += Math.sin(time * 1000 + i) * 0.2

                // Draw particle
                bgCtx.beginPath()
                bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                bgCtx.fillStyle = `rgba(148, 163, 184, ${p.opacity * 0.3})` // Subtle gray-blue
                bgCtx.fill()
            }

            bgAnimationRef.current = requestAnimationFrame(animateBg)
        }

        animateBg()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            cancelAnimationFrame(bgAnimationRef.current)
        }
    }, [])

    // Setup main particle canvas and animation
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas to full width/height
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Track mouse position for subtle interaction
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = {x: e.clientX, y: e.clientY}
        }

        window.addEventListener("mousemove", handleMouseMove)

        // Create particles
        const createParticles = () => {
            const particles: Particle[] = []
            // Reduced particle count to prevent clumping
            const particleCount = Math.min(Math.floor(window.innerWidth / 60), 60)

            // Color palette - more blue-focused
            const colors = [
                {fill: "#60a5fa", glow: "#3b82f6"}, // Blue
                {fill: "#93c5fd", glow: "#60a5fa"}, // Light Blue
                {fill: "#38bdf8", glow: "#0ea5e9"}, // Sky Blue
                {fill: "#0ea5e9", glow: "#0284c7"}, // Darker Blue
                {fill: "#7dd3fc", glow: "#38bdf8"}, // Light Sky Blue
                {fill: "#a5f3fc", glow: "#67e8f9"}, // Cyan
                {fill: "#818cf8", glow: "#6366f1"}, // Indigo
            ]

            // Distribute particles more evenly across the canvas
            const cellSize = Math.sqrt((canvas.width * canvas.height) / particleCount)
            const cols = Math.ceil(canvas.width / cellSize)
            const rows = Math.ceil(canvas.height / cellSize)

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (particles.length >= particleCount) break

                    // Add some randomness to the grid position
                    const x = j * cellSize + Math.random() * cellSize
                    const y = i * cellSize + Math.random() * cellSize

                    if (x > canvas.width || y > canvas.height) continue

                    const baseRadius = Math.random() * 3 + 2
                    const colorIndex = Math.floor(Math.random() * colors.length)
                    const pixelated = Math.random() > 0.7 // 30% chance of pixelated particles

                    particles.push({
                        x,
                        y,
                        vx: (Math.random() - 0.5) * 0.4,
                        vy: (Math.random() - 0.5) * 0.4,
                        radius: baseRadius,
                        baseRadius: baseRadius,
                        color: colors[colorIndex].fill,
                        glowColor: colors[colorIndex].glow,
                        pulseSpeed: 0.02 + Math.random() * 0.03,
                        pulsePhase: Math.random() * Math.PI * 2,
                        targetX: null,
                        targetY: null,
                        targetTimer: 0,
                        pixelated,
                        connections: 0,
                    })
                }
            }

            particlesRef.current = particles
        }

        createParticles()

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update particles
            const particles = particlesRef.current
            const time = performance.now() / 1000

            // Reset connection count for all particles
            particles.forEach((p) => (p.connections = 0))

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]

                // Pulse effect
                p.pulsePhase += p.pulseSpeed
                const pulseFactor = 0.2 * Math.sin(p.pulsePhase) + 1
                p.radius = p.baseRadius * pulseFactor

                // Occasionally set new target for more interesting movement
                if (p.targetX === null || p.targetTimer <= 0) {
                    if (Math.random() < 0.01) {
                        p.targetX = Math.random() * canvas.width
                        p.targetY = Math.random() * canvas.height
                        p.targetTimer = 100 + Math.random() * 200
                    }
                } else {
                    // Move toward target with slight acceleration
                    const dx = p.targetX - p.x
                    const dy = p.targetY! - p.y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist > 5) {
                        p.vx += (dx / dist) * 0.01
                        p.vy += (dy / dist) * 0.01

                        // Limit velocity
                        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
                        if (speed > 0.8) {
                            p.vx = (p.vx / speed) * 0.8
                            p.vy = (p.vy / speed) * 0.8
                        }
                    } else {
                        p.targetX = null
                        p.targetY = null
                    }

                    p.targetTimer--
                }

                // Subtle attraction to mouse
                if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
                    const dx = mouseRef.current.x - p.x
                    const dy = mouseRef.current.y - p.y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist < 200) {
                        p.vx += (dx / dist) * 0.02
                        p.vy += (dy / dist) * 0.02
                    }
                }

                // Add repulsion between particles to prevent clumping
                for (let j = 0; j < particles.length; j++) {
                    if (i !== j) {
                        const p2 = particles[j]
                        const dx = p2.x - p.x
                        const dy = p2.y - p.y
                        const dist = Math.sqrt(dx * dx + dy * dy)

                        // Apply repulsion when particles get too close
                        if (dist < 30) {
                            const force = 0.01 / Math.max(0.1, dist)
                            p.vx -= (dx / dist) * force
                            p.vy -= (dy / dist) * force
                        }
                    }
                }

                // Move particle
                p.x += p.vx
                p.y += p.vy

                // Add slight friction
                p.vx *= 0.99
                p.vy *= 0.99

                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) {
                    p.vx *= -1
                    // Add a little randomness on bounce
                    p.vy += (Math.random() - 0.5) * 0.2
                }
                if (p.y < 0 || p.y > canvas.height) {
                    p.vy *= -1
                    // Add a little randomness on bounce
                    p.vx += (Math.random() - 0.5) * 0.2
                }

                // Draw particle
                if (p.pixelated) {
                    // Draw pixelated square particle
                    const size = p.radius * 2
                    ctx.fillStyle = p.color
                    ctx.fillRect(Math.floor(p.x - size / 2), Math.floor(p.y - size / 2), size, size)

                    // Add glow effect
                    ctx.shadowColor = p.glowColor
                    ctx.shadowBlur = 8
                    ctx.fillRect(Math.floor(p.x - size / 2), Math.floor(p.y - size / 2), size, size)
                    ctx.shadowBlur = 0
                } else {
                    // Draw circular particle with glow
                    ctx.beginPath()
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)

                    // Create radial gradient for glow effect
                    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2)
                    gradient.addColorStop(0, p.color)
                    gradient.addColorStop(1, "rgba(0,0,0,0)")

                    ctx.fillStyle = gradient
                    ctx.fill()

                    // Inner circle
                    ctx.beginPath()
                    ctx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2)
                    ctx.fillStyle = p.color
                    ctx.fill()
                }
            }

            // Update connections
            const connections = connectionsRef.current
            const newConnections: Connection[] = []

            // Check for new connections - reduced connection distance and max connections per particle
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i]
                    const p2 = particles[j]

                    // Skip if either particle already has too many connections
                    const maxConnectionsPerParticle = 2
                    if (p1.connections >= maxConnectionsPerParticle || p2.connections >= maxConnectionsPerParticle) {
                        continue
                    }

                    const dx = p2.x - p1.x
                    const dy = p2.y - p1.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    // Reduced connection distance
                    const connectionDistance = 180
                    if (distance < connectionDistance) {
                        // Check if connection already exists
                        const existingConnection = connections.find(
                            (c) => (c.p1 === p1 && c.p2 === p2) || (c.p1 === p2 && c.p2 === p1),
                        )

                        if (existingConnection) {
                            // Update existing connection
                            existingConnection.distance = distance
                            existingConnection.alpha = 1 - distance / connectionDistance

                            // If connection was splitting but particles are close again
                            if (existingConnection.splitting && distance < connectionDistance * 0.7) {
                                existingConnection.splitting = false
                                existingConnection.splitProgress = 0

                                // Increased chance to create energy burst when reconnecting
                                if (Math.random() < 0.5) {
                                    existingConnection.energyBurst = true
                                    existingConnection.burstProgress = 0
                                    existingConnection.burstColor = Math.random() < 0.5 ? p1.glowColor : p2.glowColor
                                }
                            }

                            newConnections.push(existingConnection)
                            p1.connections++
                            p2.connections++
                        } else {
                            // Create new connection
                            newConnections.push({
                                p1,
                                p2,
                                distance,
                                alpha: 1 - distance / connectionDistance,
                                splitting: false,
                                splitProgress: 0,
                                splitPoint: {x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2},
                                energyBurst: false,
                                burstProgress: 0,
                                burstColor: p1.glowColor,
                            })
                            p1.connections++
                            p2.connections++
                        }
                    } else {
                        // If connection exists but particles are now too far, mark as splitting
                        const existingConnection = connections.find(
                            (c) => (c.p1 === p1 && c.p2 === p2) || (c.p1 === p2 && c.p2 === p1),
                        )

                        if (existingConnection && !existingConnection.splitting) {
                            existingConnection.splitting = true
                            existingConnection.splitProgress = 0
                            existingConnection.splitPoint = {
                                x: (p1.x + p2.x) / 2,
                                y: (p1.y + p2.y) / 2,
                            }
                            newConnections.push(existingConnection)
                            p1.connections++
                            p2.connections++
                        } else if (existingConnection && existingConnection.splitProgress < 1) {
                            // Slower split progress for more dramatic effect
                            existingConnection.splitProgress += 0.02
                            newConnections.push(existingConnection)
                            p1.connections++
                            p2.connections++
                        }
                    }
                }
            }

            // Draw connections
            for (const conn of newConnections) {
                if (conn.energyBurst) {
                    // Draw energy burst animation - enhanced
                    conn.burstProgress += 0.05

                    if (conn.burstProgress < 1) {
                        ctx.beginPath()
                        ctx.arc((conn.p1.x + conn.p2.x) / 2, (conn.p1.y + conn.p2.y) / 2, conn.burstProgress * 40, 0, Math.PI * 2)

                        const gradient = ctx.createRadialGradient(
                            (conn.p1.x + conn.p2.x) / 2,
                            (conn.p1.y + conn.p2.y) / 2,
                            0,
                            (conn.p1.x + conn.p2.x) / 2,
                            (conn.p1.y + conn.p2.y) / 2,
                            conn.burstProgress * 40,
                        )

                        gradient.addColorStop(0, conn.burstColor)
                        gradient.addColorStop(0.6, `${conn.burstColor}80`)
                        gradient.addColorStop(1, "rgba(0,0,0,0)")

                        ctx.fillStyle = gradient
                        ctx.fill()

                        // Add extra glow for more impact
                        ctx.shadowColor = conn.burstColor
                        ctx.shadowBlur = 15
                        ctx.fill()
                        ctx.shadowBlur = 0
                    } else {
                        conn.energyBurst = false
                    }
                }

                if (conn.splitting) {
                    // Draw splitting connection - enhanced for more impact
                    const progress = conn.splitProgress

                    if (progress < 1) {
                        // Calculate points for split animation
                        const midX = conn.splitPoint.x
                        const midY = conn.splitPoint.y

                        // Draw line from p1 to midpoint with enhanced energy effect
                        ctx.beginPath()
                        ctx.moveTo(conn.p1.x, conn.p1.y)

                        // Create lightning-like effect with more segments
                        const segments = 6
                        const segmentLength = 1 / segments

                        for (let i = 1; i < segments; i++) {
                            const segProgress = i * segmentLength
                            const segX = conn.p1.x + (midX - conn.p1.x) * segProgress * (1 - progress)
                            const segY = conn.p1.y + (midY - conn.p1.y) * segProgress * (1 - progress)

                            // Add more randomness for jagged effect
                            const jitterFactor = Math.min(1, progress * 3) // Increases as split progresses
                            const offsetX = (Math.random() - 0.5) * 8 * jitterFactor
                            const offsetY = (Math.random() - 0.5) * 8 * jitterFactor

                            ctx.lineTo(segX + offsetX, segY + offsetY)
                        }

                        ctx.lineTo(conn.p1.x + (midX - conn.p1.x) * (1 - progress), conn.p1.y + (midY - conn.p1.y) * (1 - progress))

                        // Create gradient for energy effect - brighter
                        const gradient1 = ctx.createLinearGradient(
                            conn.p1.x,
                            conn.p1.y,
                            conn.p1.x + (midX - conn.p1.x) * (1 - progress),
                            conn.p1.y + (midY - conn.p1.y) * (1 - progress),
                        )

                        gradient1.addColorStop(0, conn.p1.color)
                        gradient1.addColorStop(
                            0.7,
                            "#ffffff", // Bright white in the middle for more impact
                        )
                        gradient1.addColorStop(
                            1,
                            `rgba(${Number.parseInt(conn.p1.color.slice(1, 3), 16)}, ${Number.parseInt(conn.p1.color.slice(3, 5), 16)}, ${Number.parseInt(conn.p1.color.slice(5, 7), 16)}, 0)`,
                        )

                        ctx.strokeStyle = gradient1
                        ctx.lineWidth = 3 * (1 - progress) // Thicker line
                        ctx.stroke()

                        // Add stronger glow effect
                        ctx.shadowColor = conn.p1.glowColor
                        ctx.shadowBlur = 12
                        ctx.stroke()
                        ctx.shadowBlur = 0

                        // Draw line from p2 to midpoint with enhanced energy effect
                        ctx.beginPath()
                        ctx.moveTo(conn.p2.x, conn.p2.y)

                        // Create lightning-like effect for second part
                        for (let i = 1; i < segments; i++) {
                            const segProgress = i * segmentLength
                            const segX = conn.p2.x + (midX - conn.p2.x) * segProgress * (1 - progress)
                            const segY = conn.p2.y + (midY - conn.p2.y) * segProgress * (1 - progress)

                            // Add more randomness for jagged effect
                            const jitterFactor = Math.min(1, progress * 3)
                            const offsetX = (Math.random() - 0.5) * 8 * jitterFactor
                            const offsetY = (Math.random() - 0.5) * 8 * jitterFactor

                            ctx.lineTo(segX + offsetX, segY + offsetY)
                        }

                        ctx.lineTo(conn.p2.x + (midX - conn.p2.x) * (1 - progress), conn.p2.y + (midY - conn.p2.y) * (1 - progress))

                        // Create gradient for energy effect - brighter
                        const gradient2 = ctx.createLinearGradient(
                            conn.p2.x,
                            conn.p2.y,
                            conn.p2.x + (midX - conn.p2.x) * (1 - progress),
                            conn.p2.y + (midY - conn.p2.y) * (1 - progress),
                        )

                        gradient2.addColorStop(0, conn.p2.color)
                        gradient2.addColorStop(
                            0.7,
                            "#ffffff", // Bright white in the middle for more impact
                        )
                        gradient2.addColorStop(
                            1,
                            `rgba(${Number.parseInt(conn.p2.color.slice(1, 3), 16)}, ${Number.parseInt(conn.p2.color.slice(3, 5), 16)}, ${Number.parseInt(conn.p2.color.slice(5, 7), 16)}, 0)`,
                        )

                        ctx.strokeStyle = gradient2
                        ctx.lineWidth = 3 * (1 - progress) // Thicker line
                        ctx.stroke()

                        // Add stronger glow effect
                        ctx.shadowColor = conn.p2.glowColor
                        ctx.shadowBlur = 12
                        ctx.stroke()
                        ctx.shadowBlur = 0

                        // Add sparks at the split point
                        if (progress > 0.2 && progress < 0.8) {
                            const sparkCount = 3
                            for (let i = 0; i < sparkCount; i++) {
                                const angle = Math.random() * Math.PI * 2
                                const distance = Math.random() * 10 * progress
                                const sparkX = midX + Math.cos(angle) * distance
                                const sparkY = midY + Math.sin(angle) * distance

                                ctx.beginPath()
                                ctx.arc(sparkX, sparkY, 1 + Math.random() * 2, 0, Math.PI * 2)
                                ctx.fillStyle = "#ffffff"
                                ctx.fill()

                                ctx.shadowColor = "#60a5fa"
                                ctx.shadowBlur = 8
                                ctx.fill()
                                ctx.shadowBlur = 0
                            }
                        }
                    }
                } else {
                    // Draw normal connection with energy effect
                    ctx.beginPath()

                    // Create lightning-like effect
                    ctx.moveTo(conn.p1.x, conn.p1.y)

                    const segments = 5
                    const dx = (conn.p2.x - conn.p1.x) / segments
                    const dy = (conn.p2.y - conn.p1.y) / segments

                    for (let i = 1; i < segments; i++) {
                        const jitterAmount = 2 * Math.sin(time * 2 + i) // Animated jitter
                        const offsetX = (Math.random() - 0.5) * jitterAmount
                        const offsetY = (Math.random() - 0.5) * jitterAmount

                        ctx.lineTo(conn.p1.x + dx * i + offsetX, conn.p1.y + dy * i + offsetY)
                    }

                    ctx.lineTo(conn.p2.x, conn.p2.y)

                    // Create gradient for line - more blue
                    const gradient = ctx.createLinearGradient(conn.p1.x, conn.p1.y, conn.p2.x, conn.p2.y)
                    gradient.addColorStop(0, conn.p1.color)
                    gradient.addColorStop(1, conn.p2.color)

                    // Reduce opacity of connections for better text visibility
                    ctx.strokeStyle = gradient
                    ctx.globalAlpha = 0.7 // Reduced opacity
                    ctx.lineWidth = 1.5
                    ctx.stroke()
                    ctx.globalAlpha = 1.0 // Reset opacity

                    // Add glow effect
                    ctx.shadowColor = Math.random() < 0.5 ? conn.p1.glowColor : conn.p2.glowColor
                    ctx.shadowBlur = 5
                    ctx.globalAlpha = 0.5 // Reduced glow opacity
                    ctx.stroke()
                    ctx.globalAlpha = 1.0 // Reset opacity
                    ctx.shadowBlur = 0

                    // Occasionally add energy pulse along the line
                    if (Math.random() < 0.01) {
                        const pulsePosition = Math.random()
                        const pulseX = conn.p1.x + (conn.p2.x - conn.p1.x) * pulsePosition
                        const pulseY = conn.p1.y + (conn.p2.y - conn.p1.y) * pulsePosition

                        ctx.beginPath()
                        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2)
                        ctx.fillStyle = "white"
                        ctx.fill()

                        ctx.shadowColor = "white"
                        ctx.shadowBlur = 10
                        ctx.fill()
                        ctx.shadowBlur = 0
                    }
                }
            }

            connectionsRef.current = newConnections
            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            window.removeEventListener("mousemove", handleMouseMove)
            cancelAnimationFrame(animationRef.current)
        }
    }, [])

    return (
        <>
            <canvas ref={bgCanvasRef} className="absolute top-0 left-0 w-full h-full"/>
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"/>
        </>
    )
}
