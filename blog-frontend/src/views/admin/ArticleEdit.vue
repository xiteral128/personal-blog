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
import { getAdminArticleDetail, saveArticle, uploadImage } from '../../api/admin'
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

const form = reactive({
  id: undefined as number | undefined,
  title: '',
  summary: '',
  content: '',
  category_id: 1,
  status: 1
})

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
