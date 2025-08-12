// import { onBeforeUnmount, onMounted } from 'vue'
// export const worker = new Worker(new URL('@/workers/worker1.js', import.meta.url), {
//   type: 'module',
// })
// onMounted(() => {
//   console.log(worker)
//   worker.onmessage = (e) => {
//     console.log(1)
//     console.log(e.data)
//   }
//   worker.onerror = (error) => {
//     console.error('Worker 错误:', error)
//   }
// })
// onBeforeUnmount(() => {
//   worker.terminate()
// })
