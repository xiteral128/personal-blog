<template>
  <div class="max-w-5xl mx-auto space-y-10 animate-fade-in-up pb-10">
    
    <!-- 头部横幅区 (英雄卡片) -->
    <div class="cyber-card rounded-3xl overflow-hidden relative group">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-black/80 z-0"></div>
      
      <!-- 极客风格背景网格 -->
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#6366f1 1px, transparent 1px); background-size: 20px 20px;"></div>
      
      <div class="relative z-10 p-10 sm:p-16 flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <!-- 头像区 -->
        <div class="relative group-hover:scale-105 transition-transform duration-500 flex-shrink-0">
          <div class="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
          <img src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=256&auto=format&fit=crop" alt="Hongyi" class="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-indigo-400/50 object-cover relative z-10 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
          <!-- 状态绿点 -->
          <div class="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center z-20">
            <div class="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]"></div>
          </div>
        </div>

        <!-- 简介文字区 -->
        <div class="text-center sm:text-left flex-1">
          <div class="inline-block px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-mono mb-4">
            <span class="mr-2">⚡</span> STATUS: ONLINE & CODING
          </div>
          <h1 class="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight mb-2">
            Hi, I'm <span class="text-indigo-400 glitch-text relative inline-block">Hongyi</span>
          </h1>
          <div class="h-8 flex justify-center sm:justify-start items-center">
            <h2 class="text-lg sm:text-xl text-gray-400 font-mono typing-text inline-block">
              > A Full Stack Developer crafting the web.
            </h2>
          </div>
          <p class="mt-4 text-gray-400 max-w-2xl leading-relaxed text-sm sm:text-base">
            欢迎来到我的个人数字基地！我热衷于前后端全栈开发，喜欢将复杂的逻辑转化为优雅的代码，并始终保持对新技术的强烈求知欲。
          </p>
          
          <!-- 社交链接 -->
          <div class="mt-8 flex justify-center sm:justify-start gap-4">
            <a href="https://github.com/xiteral128" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-indigo-600 text-gray-300 hover:text-white rounded-lg transition-all border border-gray-700 hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
              <span class="font-mono text-sm">GitHub</span>
            </a>
            <a href="mailto:ywqih1206979@gmail.com" class="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-pink-600 text-gray-300 hover:text-white rounded-lg transition-all border border-gray-700 hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <span class="font-mono text-sm">Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 技能树 (雷达图/进度条) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <!-- 前端技能卡片 -->
      <div class="glass-effect rounded-2xl p-8 hover-card group">
        <div class="flex items-center mb-6">
          <div class="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mr-4 border border-indigo-500/30">
            <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-white tracking-wider">FRONTEND_DEV</h3>
        </div>
        
        <div class="space-y-5">
          <!-- 技能条 1 -->
          <div>
            <div class="flex justify-between text-sm font-mono mb-1">
              <span class="text-indigo-300">Vue 3 / TypeScript</span>
              <span class="text-gray-400">90%</span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
              <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full animate-progress" style="width: 90%"></div>
            </div>
          </div>
          <!-- 技能条 2 -->
          <div>
            <div class="flex justify-between text-sm font-mono mb-1">
              <span class="text-indigo-300">Tailwind CSS / UI</span>
              <span class="text-gray-400">85%</span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
              <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full animate-progress" style="width: 85%; animation-delay: 0.2s"></div>
            </div>
          </div>
          <!-- 技能条 3 -->
          <div>
            <div class="flex justify-between text-sm font-mono mb-1">
              <span class="text-indigo-300">React / Next.js</span>
              <span class="text-gray-400">75%</span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
              <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full animate-progress" style="width: 75%; animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 后端技能卡片 -->
      <div class="glass-effect rounded-2xl p-8 hover-card group">
        <div class="flex items-center mb-6">
          <div class="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mr-4 border border-emerald-500/30">
            <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-white tracking-wider">BACKEND_DEV</h3>
        </div>
        
        <div class="space-y-5">
          <!-- 技能条 1 -->
          <div>
            <div class="flex justify-between text-sm font-mono mb-1">
              <span class="text-emerald-300">Node.js / Express</span>
              <span class="text-gray-400">80%</span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
              <div class="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full animate-progress" style="width: 80%; animation-delay: 0.1s"></div>
            </div>
          </div>
          <!-- 技能条 2 -->
          <div>
            <div class="flex justify-between text-sm font-mono mb-1">
              <span class="text-emerald-300">MySQL / Database</span>
              <span class="text-gray-400">75%</span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
              <div class="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full animate-progress" style="width: 75%; animation-delay: 0.3s"></div>
            </div>
          </div>
          <!-- 技能条 3 -->
          <div>
            <div class="flex justify-between text-sm font-mono mb-1">
              <span class="text-emerald-300">Go / Python</span>
              <span class="text-gray-400">60%</span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
              <div class="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full animate-progress" style="width: 60%; animation-delay: 0.5s"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 个人座右铭 / 代码块展示区 -->
    <div class="cyber-card rounded-2xl p-8 overflow-hidden group">
      <div class="cyber-line-top"></div>
      <div class="flex items-center justify-between border-b border-gray-700 pb-4 mb-6">
        <div class="flex space-x-2">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div class="text-gray-500 font-mono text-sm">~ / manifesto.ts</div>
      </div>
      
      <div class="font-mono text-sm sm:text-base leading-loose text-gray-300 overflow-x-auto">
        <p><span class="text-pink-400">const</span> <span class="text-blue-400">developer</span> = {</p>
        <p class="pl-4"><span class="text-indigo-300">name</span>: <span class="text-green-400">'Hongyi'</span>,</p>
        <p class="pl-4"><span class="text-indigo-300">role</span>: <span class="text-green-400">'Full Stack Creator'</span>,</p>
        <p class="pl-4"><span class="text-indigo-300">passions</span>: [<span class="text-green-400">'Coding'</span>, <span class="text-green-400">'Open Source'</span>, <span class="text-green-400">'Coffee'</span>],</p>
        <p class="pl-4"><span class="text-blue-400">writeCode</span>() {</p>
        <p class="pl-8"><span class="text-pink-400">while</span> (<span class="text-orange-400">true</span>) {</p>
        <p class="pl-12">this.<span class="text-yellow-200">learn</span>();</p>
        <p class="pl-12">this.<span class="text-yellow-200">build</span>();</p>
        <p class="pl-12">this.<span class="text-yellow-200">share</span>();</p>
        <p class="pl-8">}</p>
        <p class="pl-4">}</p>
        <p>};</p>
        <p class="mt-4 text-gray-500">// Execution started...</p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
// 极客风简历页
</script>