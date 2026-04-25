<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-[90rem] mx-auto transition-colors duration-300">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isEdit ? '编辑文章' : '发布新文章' }}</h2>
      <div class="space-x-4">
        <button @click="router.back()" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">取消</button>
        <button @click="handleSave" :disabled="isSaving" class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 shadow-md transition-colors">
          {{ isSaving ? '保存中...' : '🚀 发布大作' }}
        </button>
      </div>
    </div>
    
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">文章标题 *</label>
          <input v-model="form.title" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-3 border text-lg" placeholder="请输入吸引人的标题">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">所属分类 *</label>
          <select v-model="form.category_id" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-3 border text-lg bg-transparent">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="dark:bg-gray-800">{{ cat.name }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">文章状态</label>
          <select v-model.number="form.status" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-3 border text-base bg-transparent">
            <option :value="1" class="dark:bg-gray-800">已发布</option>
            <option :value="0" class="dark:bg-gray-800">普通草稿</option>
            <option :value="2" class="dark:bg-gray-800">AI 待审核</option>
            <option :value="3" class="dark:bg-gray-800">AI 已驳回</option>
          </select>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">文章摘要</label>
        <textarea v-model="form.summary" rows="2" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-3 border text-sm" placeholder="如果不填将自动截取正文前50个字符..."></textarea>
      </div>

      <div v-if="isEdit" class="rounded-xl border border-indigo-500/20 bg-gray-900/40 p-5">
        <div class="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 class="text-base font-bold text-indigo-100">版本历史</h3>
            <p class="mt-1 text-xs text-indigo-200/60">每次保存前都会自动记录上一版，可用于回滚误改。</p>
          </div>
          <button @click="fetchVersions" type="button" class="px-3 py-2 rounded-lg border border-indigo-400/40 text-indigo-200 text-xs font-mono hover:bg-indigo-400/10">
            REFRESH
          </button>
        </div>
        <div v-if="versions.length === 0" class="text-sm text-indigo-200/50 font-mono">NO_VERSIONS</div>
        <div v-else class="space-y-3 max-h-72 overflow-y-auto pr-1">
          <article v-for="version in versions" :key="version.id" class="rounded-lg border border-indigo-500/15 bg-gray-950/50 p-4">
            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-sm font-semibold text-gray-100 truncate">{{ version.title }}</span>
                  <span class="rounded border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[11px] text-cyan-200 font-mono">{{ version.snapshot_type }}</span>
                  <span class="rounded border border-indigo-400/30 bg-indigo-500/10 px-2 py-0.5 text-[11px] text-indigo-200 font-mono">{{ statusLabel(version.status) }}</span>
                </div>
                <p class="mt-2 text-xs text-gray-400 line-clamp-2">{{ version.contentPreview }}</p>
                <p class="mt-2 text-[11px] text-gray-500 font-mono">{{ formatTime(version.created_at) }} / {{ version.contentLength }} chars</p>
              </div>
              <button @click="restoreVersion(version.id)" type="button" class="shrink-0 px-3 py-2 rounded-lg border border-amber-400/40 text-amber-200 text-xs font-mono hover:bg-amber-400/10">
                RESTORE
              </button>
            </div>
          </article>
        </div>
      </div>

      <!-- 专业 Markdown 编辑器 -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">正文内容 (Markdown) *</label>
        </div>
        <div class="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
          <MdEditor 
            v-model="form.content" 
            :theme="appStore.theme === 'dark' ? 'dark' : 'light'"
            :toolbars="[
              'bold', 'underline', 'italic', '-', 'title', 'strikeThrough', 'sub', 'sup', 'quote', 'unorderedList', 'orderedList', 'task',
              '-', 'codeRow', 'code', 'link', 'image', 'table', 'mermaid', 'katex',
              '-', 'revoke', 'next', 'save',
              '=', 'pageFullscreen', 'fullscreen', 'preview', 'htmlPreview', 'catalog'
            ]"
            @onUploadImg="onUploadImg"
            style="height: 600px;"
            placeholder="开始编写你的大作吧...（支持截图直接 Ctrl+V 粘贴哦！）"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAdminArticleDetail, getArticleVersions, restoreArticleVersion, saveArticle, uploadImage, type ArticleVersionRecord } from '../../api/admin'
import { getCategories } from '../../api/article'
import { useAppStore } from '../../store'

// 引入 md-editor-v3 组件和样式
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const isEdit = ref(false)
const isSaving = ref(false)
const categories = ref<any[]>([])
const versions = ref<ArticleVersionRecord[]>([])

const form = reactive({
  id: undefined as number | undefined,
  title: '',
  summary: '',
  content: '',
  category_id: 1,
  status: 1
})

const statusLabel = (status: number) => {
  const map: Record<number, string> = {
    0: 'DRAFT',
    1: 'ONLINE',
    2: 'AI_REVIEW',
    3: 'REJECTED'
  }
  return map[status] || 'UNKNOWN'
}

const formatTime = (value: string) => new Date(value).toLocaleString()

const fetchVersions = async () => {
  if (!form.id) return
  try {
    versions.value = await getArticleVersions(form.id)
  } catch (error) {
    console.error('获取版本历史失败:', error)
  }
}

onMounted(async () => {
  // 加载分类数据
  try {
    const catRes = await getCategories()
    categories.value = catRes
  } catch (error) {
    console.error('获取分类失败')
  }

  const id = Number(route.query.id)
  if (id) {
    isEdit.value = true
    try {
      const article = await getAdminArticleDetail(id)
      form.id = article.id
      form.title = article.title
      form.summary = article.summary
      form.content = article.content
      form.category_id = article.category_id || 1
      form.status = article.status ?? 1
      await fetchVersions()
    } catch (error) {
      alert('获取文章详情失败，无法编辑')
      router.back()
    }
  }
})

// 处理 Markdown 编辑器图片上传
const onUploadImg = async (files: Array<File>, callback: (urls: Array<string>) => void) => {
  const resUrls = await Promise.all(
    files.map(async (file) => {
      try {
        const res = await uploadImage(file)
        return res.url || ''
      } catch (error) {
        console.error('上传图片失败:', error)
        alert(`图片 ${file.name} 上传失败`)
        return ''
      }
    })
  )
  
  // 过滤掉上传失败的图片，将成功返回的 url 传给编辑器回调函数
  callback(resUrls.filter((url): url is string => url !== ''))
}

const restoreVersion = async (versionId: number) => {
  if (!form.id) return
  if (!confirm('确定恢复到这个版本吗？当前内容会先自动保存为一个可回滚版本。')) return

  try {
    await restoreArticleVersion(form.id, versionId)
    const article = await getAdminArticleDetail(form.id)
    form.title = article.title
    form.summary = article.summary
    form.content = article.content
    form.category_id = article.category_id || 1
    form.status = article.status ?? 1
    await fetchVersions()
    alert('版本已恢复')
  } catch (error: any) {
    alert(error.message || '恢复失败')
  }
}

const handleSave = async () => {
  if (!form.title || !form.content) {
    alert('标题和内容为必填项！')
    return
  }
  
  isSaving.value = true
  try {
    await saveArticle(form)
    alert(isEdit.value ? '更新成功！' : '发布成功！')
    router.push('/admin/articles')
  } catch (error: any) {
    alert(error.message || '保存失败，请检查网络或登录状态。')
  } finally {
    isSaving.value = false
  }
}
</script>
