<template>
  <div ref="container" class="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40 dark:opacity-60 transition-opacity duration-1000"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref<HTMLElement | null>(null)
let animationFrameId: number

// Three.js 核心对象
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points

onMounted(() => {
  if (!container.value) return

  // 1. 初始化场景
  scene = new THREE.Scene()
  
  // 增加极其微弱的深空雾效
  scene.fog = new THREE.FogExp2(0x0f172a, 0.001)

  // 2. 初始化相机
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000)
  camera.position.z = 1000

  // 3. 初始化渲染器
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  // 4. 创建粒子系统 (星系)
  const particleCount = 8000 // 颗粒数量超级加倍，制造真正的星海
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  const color1 = new THREE.Color(0x6366f1) // Indigo 500
  const color2 = new THREE.Color(0xec4899) // Pink 500

  for (let i = 0; i < particleCount; i++) {
    // 缩小分布范围，同时增加粒子，让颗粒感变得非常密集
    const spread = 2500
    const x = (Math.random() - 0.5) * spread
    const y = (Math.random() - 0.5) * spread
    const z = (Math.random() - 0.5) * spread

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    // 混合颜色
    const mixedColor = color1.clone().lerp(color2, Math.random())
    colors[i * 3] = mixedColor.r
    colors[i * 3 + 1] = mixedColor.g
    colors[i * 3 + 2] = mixedColor.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // 材质
  const material = new THREE.PointsMaterial({
    size: 5, // 将尺寸回调到 5，配合高密度显得更细腻
    vertexColors: true,
    transparent: true,
    opacity: 0.8, 
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)

  // 5. 动画循环
  let mouseX = 0
  let mouseY = 0
  let targetX = 0
  let targetY = 0

  const windowHalfX = window.innerWidth / 2
  const windowHalfY = window.innerHeight / 2

  const onDocumentMouseMove = (event: MouseEvent) => {
    // 放大鼠标的移动范围，使其对星辰的影响更明显
    mouseX = (event.clientX - windowHalfX) * 2
    mouseY = (event.clientY - windowHalfY) * 2
  }

  document.addEventListener('mousemove', onDocumentMouseMove)

  const render = () => {
    targetX = mouseX * 0.05
    targetY = mouseY * 0.05

    // 减小相机的位移范围，制造一种被包裹在宇宙中“只能张望，无法逃离”的感觉
    camera.position.x += (mouseX * 0.2 - camera.position.x) * 0.05
    camera.position.y += (-mouseY * 0.2 - camera.position.y) * 0.05
    camera.lookAt(scene.position)

    // 让粒子系统以恒定速度缓慢旋转，增加迷失感
    particles.rotation.x += 0.0005
    particles.rotation.y += 0.001
    
    renderer.render(scene, camera)
    animationFrameId = requestAnimationFrame(render)
  }

  render()

  // 6. 响应窗口大小调整
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', handleResize)

  // 清理函数
  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    document.removeEventListener('mousemove', onDocumentMouseMove)
    window.removeEventListener('resize', handleResize)
    
    // 清理 WebGL 资源
    geometry.dispose()
    material.dispose()
    renderer.dispose()
    if (container.value && renderer.domElement) {
      container.value.removeChild(renderer.domElement)
    }
  })
})
</script>