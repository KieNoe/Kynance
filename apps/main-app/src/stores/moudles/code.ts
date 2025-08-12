import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// interface CodeSnippet {
//   id;
//   name;
//   createdAt;
//   updatedAt;
//   code;
// }

export const useCustomCode = defineStore('customCode', () => {
  // Key for localStorage
  const STORAGE_KEY = 'custom-code-snippets'

  // Reactive state
  const snippets = ref([
    // {
    //   id: 'gugugaga',
    //   name: 'gugugaga',
    //   createdAt: '2025-08-08',
    //   updatedAt: '2025-08-08',
    //   description: '111',
    //   code: '11111111111111111',
    // },
  ])

  // Initialize store from localStorage
  const initialize = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      snippets.value = JSON.parse(stored)
    }
  }

  // Call initialize when store is created
  initialize()

  // Save snippets to localStorage
  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets.value))
  }

  // Computed properties
  const snippetCount = computed(() => snippets.value.length)
  const snippetNames = computed(() => snippets.value.map((s) => s.name))

  // Actions
  const addSnippet = (name, code, description = '') => {
    // 验证检查
    if (!name || !name.trim()) {
      throw new Error('代码片段名称不能为空')
    }

    if (!code || !code.trim()) {
      throw new Error('代码内容不能为空')
    }

    // 检查名称是否已存在（不区分大小写）
    const nameExists = snippets.value.some(
      (snippet) => snippet.name.toLowerCase() === name.toLowerCase(),
    )
    if (nameExists) {
      throw new Error('已存在同名的代码片段')
    }

    // 检查危险字符（可根据需要调整）
    const dangerousChars = /[<>{}[\]'"`;|\\/*?=$]/
    if (dangerousChars.test(name)) {
      throw new Error('名称不能包含特殊字符：<>{}[]\'"`;|\\/*?=$')
    }
    if (dangerousChars.test(description)) {
      throw new Error('描述不能包含特殊字符：<>{}[]\'"`;|\\/*?=$')
    }

    // 所有验证通过后创建代码片段
    const now = dayjs().toISOString()
    const newSnippet = {
      id: generateId(),
      name: name.trim(),
      code: code.trim(),
      description: description.trim(),
      createdAt: now,
      updatedAt: now,
    }

    snippets.value.push(newSnippet)
    saveToStorage()
    return newSnippet
  }

  const updateSnippet = (id, updates) => {
    const index = snippets.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      snippets.value[index] = {
        ...snippets.value[index],
        ...updates,
        updatedAt: dayjs().toISOString(),
      }
      saveToStorage()
      return snippets.value[index]
    }
    return null
  }

  const deleteSnippet = (id) => {
    const index = snippets.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      snippets.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }

  const getSnippet = (id) => {
    return snippets.value.find((s) => s.id === id) || null
  }

  const clearAllSnippets = () => {
    snippets.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  // Helper function to generate unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  return {
    snippets,
    snippetCount,
    snippetNames,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    getSnippet,
    clearAllSnippets,
  }
})
