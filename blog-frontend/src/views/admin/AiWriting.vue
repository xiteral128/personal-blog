<template>
  <div class="space-y-8 animate-fade-in-up">
    <section class="cyber-card rounded-2xl shadow-lg p-8">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-indigo-500/20 pb-5 mb-6">
        <div>
          <h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-400 tracking-widest uppercase">
            AI 写作中心 / AI WRITING
          </h2>
          <p class="mt-2 text-sm text-indigo-200/60 font-mono">
            管理多个 Agent 的写作密钥，并审核它们提交的 Markdown 文章。
          </p>
        </div>
        <button @click="refreshAll" class="px-4 py-2 rounded-lg border border-cyan-400/40 text-cyan-200 font-mono hover:bg-cyan-400/10 transition-colors">
          REFRESH
        </button>
      </div>

      <div v-if="createdKey" class="mb-6 rounded-xl border border-amber-400/40 bg-amber-500/10 p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-amber-200 font-bold">新密钥只显示这一次</p>
            <p class="mt-1 text-sm text-amber-100/70">请复制给对应 Agent。数据库只保存哈希，之后无法再次查看明文。</p>
          </div>
          <button @click="createdKey = ''" class="text-amber-100/60 hover:text-amber-100">关闭</button>
        </div>
        <textarea ref="keyTextarea" :value="createdKey" readonly class="mt-4 w-full h-24 resize-none rounded-lg bg-gray-950/70 border border-amber-400/30 p-3 font-mono text-sm text-amber-100"></textarea>
        <div class="mt-3 flex flex-wrap items-center gap-3">
          <button @click="copyCreatedKey" class="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-100 font-mono hover:bg-amber-500/30">
            COPY_KEY
          </button>
          <span v-if="copyFeedback" class="text-sm text-amber-100/80 font-mono">{{ copyFeedback }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-[22rem_1fr] gap-6">
        <form class="rounded-xl border border-indigo-500/20 bg-gray-950/40 p-5 space-y-4" @submit.prevent="createKey">
          <h3 class="font-black text-indigo-200 tracking-widest uppercase">创建 Agent Key</h3>
          <div>
            <label class="block text-xs font-mono text-indigo-200/70 mb-1">Agent 名称</label>
            <input v-model="keyForm.name" type="text" class="w-full rounded-lg bg-gray-900 border border-indigo-500/30 p-3 text-gray-100" placeholder="Codex 写作助手">
          </div>
          <div>
            <label class="block text-xs font-mono text-indigo-200/70 mb-1">权限模式</label>
            <select v-model="keyForm.mode" class="w-full rounded-lg bg-gray-900 border border-indigo-500/30 p-3 text-gray-100">
              <option value="review">人类拍板</option>
              <option value="autonomous">AI 全权负责</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-mono text-indigo-200/70 mb-1">每日创建上限</label>
            <input v-model.number="keyForm.daily_limit" type="number" min="1" max="100" class="w-full rounded-lg bg-gray-900 border border-indigo-500/30 p-3 text-gray-100">
          </div>
          <button :disabled="isCreatingKey" class="w-full rounded-lg bg-indigo-600/80 border border-indigo-400/50 py-3 font-mono text-indigo-50 hover:bg-indigo-500 disabled:opacity-50">
            {{ isCreatingKey ? 'CREATING...' : 'GENERATE_KEY' }}
          </button>
        </form>

        <div class="rounded-xl border border-indigo-500/20 bg-gray-950/40 overflow-hidden">
          <div class="border-b border-indigo-500/20 bg-indigo-950/30 px-5 py-3 text-xs text-indigo-200/70">
            完整 API Key 只在创建或重置后显示一次。已有 Key 无法找回明文，需要点 RESET_KEY 生成新 Key。
          </div>
          <table class="min-w-full divide-y divide-indigo-500/20">
            <thead class="bg-indigo-900/30">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-mono text-indigo-200">Agent</th>
                <th class="px-5 py-3 text-left text-xs font-mono text-indigo-200">模式</th>
                <th class="px-5 py-3 text-left text-xs font-mono text-indigo-200">前缀</th>
                <th class="px-5 py-3 text-left text-xs font-mono text-indigo-200">最近使用</th>
                <th class="px-5 py-3 text-left text-xs font-mono text-indigo-200">状态</th>
                <th class="px-5 py-3 text-left text-xs font-mono text-indigo-200">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-indigo-500/10">
              <tr v-for="key in keys" :key="key.id" class="hover:bg-indigo-500/10">
                <td class="px-5 py-4 text-sm text-gray-100">{{ key.name }}</td>
                <td class="px-5 py-4 text-sm font-mono" :class="key.mode === 'autonomous' ? 'text-emerald-300' : 'text-amber-300'">
                  {{ modeLabel(key.mode) }}
                </td>
                <td class="px-5 py-4 text-sm font-mono text-cyan-200">{{ key.keyPrefix }}...</td>
                <td class="px-5 py-4 text-sm text-gray-400">{{ formatTime(key.lastUsedAt) }}</td>
                <td class="px-5 py-4 text-sm">
                  <span class="px-2 py-1 rounded border text-xs font-mono" :class="key.enabled ? 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10' : 'border-rose-400/40 text-rose-300 bg-rose-500/10'">
                    {{ key.enabled ? 'ENABLED' : 'REVOKED' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-sm">
                  <div v-if="key.enabled" class="flex flex-wrap gap-3 font-mono">
                    <button @click="rotateKey(key.id)" class="text-cyan-300 hover:text-cyan-200">
                      RESET_KEY
                    </button>
                    <button @click="revokeKey(key.id)" class="text-rose-300 hover:text-rose-200">
                      REVOKE
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="keys.length === 0" class="py-12 text-center text-indigo-200/50 font-mono">NO_KEYS</div>
        </div>
      </div>
    </section>

    <section class="cyber-card rounded-2xl shadow-lg p-8">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-indigo-500/20 pb-5 mb-6">
        <div>
          <h3 class="text-xl font-black text-indigo-100 tracking-widest uppercase">AI 草稿箱</h3>
          <p class="mt-2 text-sm text-indigo-200/60 font-mono">人类拍板模式会进入待审核；AI 全权负责模式也会保留来源记录。</p>
        </div>
        <select v-model="draftStatus" @change="fetchDrafts" class="w-52 rounded-lg bg-gray-900 border border-indigo-500/30 p-3 text-gray-100">
          <option value="">全部 AI 文章</option>
          <option :value="2">AI 待审核</option>
          <option :value="0">普通草稿</option>
          <option :value="1">已发布</option>
          <option :value="3">已驳回</option>
        </select>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <article v-for="draft in drafts" :key="draft.id" class="rounded-xl border border-indigo-500/20 bg-gray-950/40 p-5">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h4 class="text-lg font-bold text-gray-100 truncate">{{ draft.title }}</h4>
              <p class="mt-2 text-sm text-gray-400 line-clamp-2">{{ draft.summary }}</p>
            </div>
            <span class="shrink-0 px-2 py-1 rounded border text-xs font-mono" :class="statusClass(draft.status)">
              {{ statusLabel(draft.status) }}
            </span>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-3 text-xs font-mono text-indigo-200/60">
            <span>Agent: {{ draft.agent_name || 'UNKNOWN' }}</span>
            <span>Mode: {{ modeLabel(draft.agent_mode || 'review') }}</span>
            <span>Category: {{ draft.category_name || '-' }}</span>
            <span>Updated: {{ formatTime(draft.updated_at) }}</span>
          </div>
          <div v-if="draft.review_note" class="mt-4 rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">
            {{ draft.review_note }}
          </div>
          <div class="mt-5 flex flex-wrap gap-3 font-mono text-sm">
            <button @click="editDraft(draft.id)" class="px-3 py-2 rounded-lg border border-indigo-400/40 text-indigo-200 hover:bg-indigo-400/10">
              EDIT
            </button>
            <button @click="approveDraft(draft.id, false)" class="px-3 py-2 rounded-lg border border-cyan-400/40 text-cyan-200 hover:bg-cyan-400/10">
              PASS_TO_DRAFT
            </button>
            <button @click="approveDraft(draft.id, true)" class="px-3 py-2 rounded-lg border border-emerald-400/40 text-emerald-200 hover:bg-emerald-400/10">
              PUBLISH
            </button>
            <button @click="rejectDraft(draft.id)" class="px-3 py-2 rounded-lg border border-rose-400/40 text-rose-200 hover:bg-rose-400/10">
              REJECT
            </button>
          </div>
        </article>
      </div>
      <div v-if="drafts.length === 0" class="py-16 text-center text-indigo-200/50 font-mono">NO_AI_ARTICLES</div>
    </section>

    <section class="cyber-card rounded-2xl shadow-lg p-8">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-indigo-500/20 pb-5 mb-6">
        <div>
          <h3 class="text-xl font-black text-indigo-100 tracking-widest uppercase">AI 调用日志</h3>
          <p class="mt-2 text-sm text-indigo-200/60 font-mono">记录 Agent 调用 AI 写作 API 的状态、耗时、请求体大小和 TraceId。</p>
        </div>
        <button @click="fetchCallLogs" class="px-4 py-2 rounded-lg border border-cyan-400/40 text-cyan-200 font-mono hover:bg-cyan-400/10 transition-colors">
          REFRESH_LOGS
        </button>
      </div>

      <div class="overflow-x-auto rounded-xl border border-indigo-500/20 bg-gray-950/40">
        <table class="min-w-full divide-y divide-indigo-500/20">
          <thead class="bg-indigo-900/30">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-mono text-indigo-200">Agent</th>
              <th class="px-5 py-3 text-left text-xs font-mono text-indigo-200">接口</th>
              <th class="px-5 py-3 text-left text-xs font-mono text-indigo-200">状态</th>
              <th class="px-5 py-3 text-left text-xs font-mono text-indigo-200">耗时</th>
              <th class="px-5 py-3 text-left text-xs font-mono text-indigo-200">请求体</th>
              <th class="px-5 py-3 text-left text-xs font-mono text-indigo-200">IP</th>
              <th class="px-5 py-3 text-left text-xs font-mono text-indigo-200">TraceId</th>
              <th class="px-5 py-3 text-left text-xs font-mono text-indigo-200">时间</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-indigo-500/10">
            <tr v-for="log in callLogs" :key="log.id" class="hover:bg-indigo-500/10">
              <td class="px-5 py-4 text-sm text-gray-100 whitespace-nowrap">{{ log.agent_name || 'UNKNOWN' }}</td>
              <td class="px-5 py-4 text-xs font-mono text-cyan-100 min-w-72">
                <span class="text-cyan-300">{{ log.method }}</span>
                <span class="ml-2 text-gray-300">{{ log.path }}</span>
              </td>
              <td class="px-5 py-4 text-sm whitespace-nowrap">
                <span class="px-2 py-1 rounded border text-xs font-mono" :class="callStatusClass(log)">
                  {{ log.status_code }}
                </span>
              </td>
              <td class="px-5 py-4 text-sm font-mono text-indigo-100 whitespace-nowrap">{{ log.latency_ms }} ms</td>
              <td class="px-5 py-4 text-sm font-mono text-indigo-100 whitespace-nowrap">{{ formatBytes(log.request_bytes) }}</td>
              <td class="px-5 py-4 text-sm font-mono text-gray-400 whitespace-nowrap">{{ log.ip_address || '-' }}</td>
              <td class="px-5 py-4 text-sm font-mono text-gray-400 whitespace-nowrap">{{ shortTraceId(log.trace_id) }}</td>
              <td class="px-5 py-4 text-sm text-gray-400 whitespace-nowrap">{{ formatTime(log.created_at) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="callLogs.length === 0" class="py-12 text-center text-indigo-200/50 font-mono">NO_AI_CALL_LOGS</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  approveAiDraft,
  createAiKey,
  getAiCallLogs,
  getAiDrafts,
  getAiKeys,
  rejectAiDraft,
  revokeAiKey,
  rotateAiKey,
  type AiCallLogRecord,
  type AiDraftRecord,
  type AiKeyRecord
} from '../../api/admin'

const router = useRouter()
const keys = ref<AiKeyRecord[]>([])
const drafts = ref<AiDraftRecord[]>([])
const callLogs = ref<AiCallLogRecord[]>([])
const createdKey = ref('')
const copyFeedback = ref('')
const isCreatingKey = ref(false)
const draftStatus = ref<number | ''>(2)
const keyTextarea = ref<HTMLTextAreaElement | null>(null)
let copyFeedbackTimer: ReturnType<typeof window.setTimeout> | undefined

const keyForm = reactive({
  name: '',
  mode: 'review' as 'autonomous' | 'review',
  daily_limit: 20
})

const modeLabel = (mode: 'autonomous' | 'review' | string) => {
  return mode === 'autonomous' ? 'AI 全权负责' : '人类拍板'
}

const statusLabel = (status: number) => {
  const map: Record<number, string> = {
    0: 'DRAFT',
    1: 'ONLINE',
    2: 'AI_REVIEW',
    3: 'REJECTED'
  }
  return map[status] || 'UNKNOWN'
}

const statusClass = (status: number) => {
  if (status === 1) return 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10'
  if (status === 2) return 'border-amber-400/40 text-amber-300 bg-amber-500/10'
  if (status === 3) return 'border-rose-400/40 text-rose-300 bg-rose-500/10'
  return 'border-cyan-400/40 text-cyan-300 bg-cyan-500/10'
}

const formatTime = (value?: string | null) => {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

const callStatusClass = (log: AiCallLogRecord) => {
  const success = log.success === true || log.success === 1
  if (success) return 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10'
  if (log.status_code === 401 || log.status_code === 403) return 'border-amber-400/40 text-amber-300 bg-amber-500/10'
  return 'border-rose-400/40 text-rose-300 bg-rose-500/10'
}

const formatBytes = (value: number) => {
  if (value < 1024) return `${value} B`
  return `${(value / 1024).toFixed(1)} KB`
}

const shortTraceId = (value?: string | null) => value ? value.slice(0, 12) : '-'

const fetchKeys = async () => {
  keys.value = await getAiKeys()
}

const fetchDrafts = async () => {
  drafts.value = await getAiDrafts({ status: draftStatus.value })
}

const fetchCallLogs = async () => {
  callLogs.value = await getAiCallLogs({ limit: 100 })
}

const refreshAll = async () => {
  await Promise.all([fetchKeys(), fetchDrafts(), fetchCallLogs()])
}

const showCopyFeedback = (message: string) => {
  if (copyFeedbackTimer) window.clearTimeout(copyFeedbackTimer)
  copyFeedback.value = message
  copyFeedbackTimer = window.setTimeout(() => {
    copyFeedback.value = ''
  }, 2500)
}

const selectCreatedKey = () => {
  const textarea = keyTextarea.value
  if (!textarea) return false

  textarea.focus()
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)
  return true
}

const createKey = async () => {
  if (!keyForm.name.trim()) {
    alert('请填写 Agent 名称')
    return
  }
  isCreatingKey.value = true
  try {
    const result = await createAiKey({ ...keyForm })
    createdKey.value = result.apiKey
    copyFeedback.value = ''
    keyForm.name = ''
    await fetchKeys()
    await nextTick()
    selectCreatedKey()
  } catch (error: any) {
    alert(error.message || '创建失败')
  } finally {
    isCreatingKey.value = false
  }
}

const copyCreatedKey = async () => {
  if (!createdKey.value) return

  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(createdKey.value)
      showCopyFeedback('已复制')
      return
    }
  } catch {
    // Fall back to selecting the textarea below.
  }

  try {
    if (selectCreatedKey() && document.execCommand('copy')) {
      showCopyFeedback('已复制')
      return
    }
  } catch {
    // Some browsers block execCommand; leave the key selected for manual copy.
  }

  selectCreatedKey()
  showCopyFeedback('已选中，请手动复制')
}

const rotateKey = async (id: number) => {
  if (!confirm('确定重置这个 Agent 的 API Key 吗？旧 Key 会立刻失效，新 Key 只显示这一次。')) return

  try {
    const result = await rotateAiKey(id)
    createdKey.value = result.apiKey
    copyFeedback.value = ''
    await fetchKeys()
    await nextTick()
    selectCreatedKey()
  } catch (error: any) {
    alert(error.message || '重置失败')
  }
}

const revokeKey = async (id: number) => {
  if (!confirm('确定吊销这个 AI API Key 吗？吊销后 Agent 将无法继续调用。')) return
  await revokeAiKey(id)
  await fetchKeys()
}

const editDraft = (id: number) => {
  router.push(`/admin/articles/edit?id=${id}`)
}

const approveDraft = async (id: number, publish: boolean) => {
  const message = publish ? '确定通过并发布这篇 AI 文章吗？' : '确定通过为普通草稿吗？'
  if (!confirm(message)) return
  await approveAiDraft(id, publish)
  await fetchDrafts()
}

const rejectDraft = async (id: number) => {
  const note = prompt('请输入驳回原因（可选）') || ''
  await rejectAiDraft(id, note)
  await fetchDrafts()
}

onMounted(refreshAll)
</script>
