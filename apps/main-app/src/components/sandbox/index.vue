<template>
  <div class="sandbox-editor">
    <textarea v-model="dslCode" placeholder="Enter your DSL code here"></textarea>
    <button @click="compileAndRun">Run</button>

    <div v-if="output !== null" class="output">
      <h3>Output:</h3>
      <pre>{{ output }}</pre>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { DSLCompiler } from '@kynance/strategy-engine'

const dslCode = ref('')
const output = ref(null)
const error = ref(null)

const compileAndRun = async () => {
  error.value = null
  output.value = null

  try {
    const dslFunction = await DSLCompiler.createFunction(dslCode.value)
    const result = await dslFunction({ some: 'input' })
    output.value = result
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}
</script>
<style scoped>
.sandbox-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  min-height: 200px;
  font-family: monospace;
}

.output,
.error {
  padding: 1rem;
  border-radius: 4px;
}

.output {
  background-color: #f0f0f0;
}

.error {
  background-color: #ffebee;
  color: #d32f2f;
}
</style>
