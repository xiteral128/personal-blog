<template>
  <div class="cyber-card rounded-2xl shadow-lg p-8 animate-fade-in-up">
    <div class="flex justify-between items-center mb-8 border-b border-indigo-500/20 pb-4 gap-4 flex-wrap">
      <h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 tracking-widest uppercase">评论管理 / COMMENTS</h2>
      <div class="flex items-center gap-3 text-sm font-mono">
        <span class="px-3 py-1 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-500/30">APPROVED {{ summary.approved }}</span>
        <span class="px-3 py-1 rounded bg-amber-900/40 text-amber-400 border border-amber-500/30">PENDING {{ summary.pending }}</span>
        <select v-model="statusFilter" @change="fetchComments" class="bg-gray-900/60 border border-indigo-500/30 rounded px-3 py-2 text-indigo-200">
          <option value="">ALL</option>
          <option value="0">PENDING</option>
          <option value="1">APPROVED</option>
        </select>
      </div>
    </div>

    <div class="bg-gray-900/50 rounded-xl border border-indigo-500/20 overflow-hidden">
      <table class="min-w-full divide-y divide-indigo-500/20">
        <thead class="bg-indigo-900/30 backdrop-blur-md">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono w-1/4">评论者</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono w-2/4">内容 & 来源</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono">状态</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-indigo-500/10">
          <tr v-for="comment in comments" :key="comment.id" class="hover:bg-indigo-500/10 transition-colors duration-200">
            <td class="px-6 py-5">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img class="h-10 w-10 rounded-lg border border-indigo-500/30" :src="`https://ui-avatars.com/api/?name=${comment.nickname}&background=random`" alt="" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-bold text-gray-200">{{ comment.nickname }}</div>
                  <div class="text-xs font-mono text-gray-500">{{ comment.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-5">
              <div class="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{{ comment.content }}</div>
              <div class="text-xs font-mono text-indigo-400/70 mt-3 flex items-center">
                <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                REF: {{ comment.article_title || 'UNKNOWN' }}
              </div>
            </td>
            <td class="px-6 py-5 whitespace-nowrap">
              <span v-if="comment.status === 1" class="px-3 py-1 inline-flex text-xs font-mono rounded bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]">APPROVED</span>
              <span v-else class="px-3 py-1 inline-flex text-xs font-mono rounded bg-amber-900/40 text-amber-400 border border-amber-500/30 shadow-[inset_0_0_10px_rgba(245,158,11,0.2)]">PENDING</span>
            </td>
            <td class="px-6 py-5 whitespace-nowrap text-sm font-mono space-x-4">
              <button v-if="comment.status === 0" @click="handleStatusChange(comment.id, 1)" class="text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest">PASS</button>
              <button v-if="comment.status === 1" @click="handleStatusChange(comment.id, 0)" class="text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-widest">REJECT</button>
              <button @click="handleDelete(comment.id)" class="text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-widest">DEL</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="comments.length === 0" class="text-center py-16 text-indigo-300/50 font-mono tracking-widest">NO_COMMENTS_FOUND</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllComments, updateCommentStatus, deleteAdminComment } from '../../api/admin'

const comments = ref<any[]>([])
const summary = ref({ approved: 0, pending: 0 })
const statusFilter = ref('')

const fetchComments = async () => {
  try {
    const res = await getAllComments(statusFilter.value === '' ? undefined : { status: Number(statusFilter.value) })
    comments.value = res.list
    summary.value = res.summary
  } catch (error) {
    console.error('获取评论列表失败:', error)
  }
}

onMounted(() => {
  fetchComments()
})

const handleStatusChange = async (id: number, status: number) => {
  try {
    await updateCommentStatus(id, status)
    await fetchComments()
  } catch (error: any) {
    alert(error.message || '更新状态失败')
  }
}

const handleDelete = async (id: number) => {
  if (confirm('确定要彻底删除这条评论吗？操作不可恢复。')) {
    try {
      await deleteAdminComment(id)
      await fetchComments()
    } catch (error: any) {
      alert(error.message || '删除失败')
    }
  }
}
</script>
