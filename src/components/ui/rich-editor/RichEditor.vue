<template>
  <div
    class="rich-editor"
    :data-invalid="invalid || undefined"
    :data-focused="isFocused || undefined"
  >
    <QuillEditor
      ref="quillRef"
      v-model:content="content"
      :theme="theme"
      :toolbar="effectiveToolbar"
      :modules="modules"
      :placeholder="placeholder"
      :enable="!disabled"
      :read-only="readOnly"
      :content-type="contentType"
      @text-change="handleTextChange"
      @selection-change="handleSelectionChange"
      @editor-change="handleEditorChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @ready="handleReady"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type Quill from 'quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'

  type QuillToolbarConfig = string | string[][] | object

  interface Props {
    /** V-model value - can be HTML string, text string, or Delta object */
    modelValue?: string | object
    /** Content type: 'html', 'text', or 'delta' */
    contentType?: 'html' | 'text' | 'delta'
    /** Placeholder text */
    placeholder?: string
    /** Disabled state */
    disabled?: boolean
    /** Read-only state */
    readOnly?: boolean
    /** Invalid/error state */
    invalid?: boolean
    /** Toolbar configuration - string, array, or object. Set to empty string to hide */
    toolbar?: QuillToolbarConfig
    /** Quill theme */
    theme?: string
    /** Additional Quill modules */
    modules?: Record<string, unknown>
    /** Allowed formats */
    formats?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    contentType: 'html',
    placeholder: '',
    disabled: false,
    readOnly: false,
    invalid: false,
    theme: 'snow',
  })

  interface Emits {
    (e: 'update:modelValue', value: string | object): void
    (e: 'text-change', ...args: unknown[]): void
    (e: 'selection-change', ...args: unknown[]): void
    (e: 'editor-change', ...args: unknown[]): void
    (e: 'focus', event: FocusEvent): void
    (e: 'blur', event: FocusEvent): void
    (e: 'ready', quill: Quill): void
  }

  const emit = defineEmits<Emits>()

  // Refs
  const quillRef = ref<{ getQuill?: () => Quill } | null>(null)
  const isFocused = ref(false)

  // Default toolbar configuration
  const defaultToolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['link'],
    ['clean'],
  ]

  // Computed
  const content = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  const effectiveToolbar = computed(() => {
    // If toolbar prop is explicitly provided, use it (including empty string to hide)
    if (props.toolbar !== undefined) {
      return props.toolbar
    }
    // Otherwise use default toolbar
    return defaultToolbar
  })

  // Methods
  const getQuillInstance = (): Quill | null => {
    return quillRef.value?.getQuill?.() || null
  }

  const focus = () => {
    const quill = getQuillInstance()
    if (quill) {
      quill.focus()
    }
  }

  const blur = () => {
    const quill = getQuillInstance()
    if (quill) {
      quill.blur()
    }
  }

  const getHTML = (): string => {
    const quill = getQuillInstance()
    return quill ? quill.root.innerHTML : ''
  }

  const getText = (): string => {
    const quill = getQuillInstance()
    return quill ? quill.getText() : ''
  }

  const getDelta = () => {
    const quill = getQuillInstance()
    return quill ? quill.getContents() : null
  }

  const setContents = (delta: unknown) => {
    const quill = getQuillInstance()
    if (quill && delta) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      quill.setContents(delta as any)
    }
  }

  const setHTML = (html: string) => {
    const quill = getQuillInstance()
    if (quill) {
      quill.root.innerHTML = html
    }
  }

  const setText = (text: string) => {
    const quill = getQuillInstance()
    if (quill) {
      quill.setText(text)
    }
  }

  const isEmpty = (): boolean => {
    if (!quillRef.value) return true

    const text = getText()
    const trimmedText = text.trim()

    // Empty if no text or only whitespace
    if (!trimmedText || trimmedText === '') return true

    // Check for Quill's empty state
    const html = getHTML()
    if (html === '<p><br></p>' || html === '<p></p>') return true

    return false
  }

  const clear = () => {
    const quill = getQuillInstance()
    if (quill) {
      quill.setText('')
    }
  }

  // Event handlers
  const handleTextChange = (...args: unknown[]) => {
    emit('text-change', ...args)
  }

  const handleSelectionChange = (...args: unknown[]) => {
    emit('selection-change', ...args)
  }

  const handleEditorChange = (...args: unknown[]) => {
    emit('editor-change', ...args)
  }

  const handleFocus = (event: FocusEvent) => {
    isFocused.value = true
    emit('focus', event)
  }

  const handleBlur = (event: FocusEvent) => {
    isFocused.value = false
    emit('blur', event)
  }

  const handleReady = (quill: Quill) => {
    emit('ready', quill)
  }

  // Expose methods
  defineExpose({
    focus,
    blur,
    getQuillInstance,
    getHTML,
    getText,
    getDelta,
    setContents,
    setHTML,
    setText,
    isEmpty,
    clear,
  })
</script>

<style scoped>
  .rich-editor {
    width: 100%;
  }

  /* Toolbar styling */
  .rich-editor :deep(.ql-toolbar.ql-snow) {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
    border: 1px solid var(--color-neutral-200);
    border-bottom: none;
    border-radius: 0.5rem 0.5rem 0 0;
    background-color: var(--color-white);
    transition: border-color 0.2s;
  }

  /* Toolbar groups */
  .rich-editor :deep(.ql-toolbar .ql-formats) {
    margin-right: 8px;
    display: flex;
    align-items: center;
    gap: 2px;
  }

  /* Toolbar buttons */
  .rich-editor :deep(.ql-toolbar button) {
    transition: all 0.2s;
  }

  .rich-editor :deep(.ql-toolbar button:hover) {
    background-color: hsl(var(--accent));
  }

  .rich-editor :deep(.ql-toolbar button.ql-active) {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  /* Editor container */
  .rich-editor :deep(.ql-container.ql-snow) {
    border: 1px solid var(--color-neutral-200);
    border-top: none;
    border-radius: 0 0 0.5rem 0.5rem;
    font-family: inherit;
    font-size: 0.875rem;
    background-color: var(--color-white);
    transition: border-color 0.2s;
  }

  /* Hover state */
  .rich-editor:hover :deep(.ql-toolbar.ql-snow),
  .rich-editor:hover :deep(.ql-container.ql-snow) {
    border-color: var(--color-neutral-300);
  }

  /* Editor content */
  .rich-editor :deep(.ql-editor) {
    min-height: 150px;
    max-height: 400px;
    overflow-y: auto;
    line-height: 1.6;
    padding: 12px 15px;
  }

  /* Placeholder styling */
  .rich-editor :deep(.ql-editor.ql-blank::before) {
    color: var(--color-neutral-400);
    font-style: normal;
  }

  /* Focus state */
  .rich-editor[data-focused='true'] :deep(.ql-toolbar.ql-snow) {
    border-color: var(--color-primary-600);
    border-bottom: none;
    box-shadow:
      0 -1px 0 0 var(--color-primary-600),
      -1px 0 0 0 var(--color-primary-600),
      1px 0 0 0 var(--color-primary-600);
  }

  .rich-editor[data-focused='true'] :deep(.ql-container.ql-snow) {
    border-color: var(--color-primary-600);
    border-top: none;
    box-shadow:
      0 1px 0 0 var(--color-primary-600),
      -1px 0 0 0 var(--color-primary-600),
      1px 0 0 0 var(--color-primary-600);
  }

  /* Disabled state */
  .rich-editor :deep(.ql-toolbar.ql-snow:has(~ .ql-container.ql-disabled)),
  .rich-editor :deep(.ql-container.ql-disabled) {
    background-color: var(--color-neutral-100);
    cursor: not-allowed;
  }

  .rich-editor :deep(.ql-editor.ql-disabled) {
    color: var(--color-neutral-400);
    cursor: not-allowed;
  }

  /* Read-only state */
  .rich-editor :deep(.ql-container.ql-snow.ql-readonly) {
    cursor: default;
  }

  .rich-editor[data-focused='true'] :deep(.ql-container.ql-snow.ql-readonly),
  .rich-editor[data-focused='true'] :deep(.ql-toolbar.ql-snow:has(~ .ql-container.ql-readonly)) {
    border-color: var(--color-neutral-200);
    box-shadow: none;
  }

  /* Error/Invalid state */
  .rich-editor[data-invalid='true'] :deep(.ql-toolbar.ql-snow) {
    border-color: var(--color-error-500);
    border-bottom: none;
    box-shadow:
      0 -1px 0 0 var(--color-error-500),
      -1px 0 0 0 var(--color-error-500),
      1px 0 0 0 var(--color-error-500);
  }

  .rich-editor[data-invalid='true'] :deep(.ql-container.ql-snow) {
    border-color: var(--color-error-500);
    border-top: none;
    box-shadow:
      0 1px 0 0 var(--color-error-500),
      -1px 0 0 0 var(--color-error-500),
      1px 0 0 0 var(--color-error-500);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .rich-editor :deep(.ql-toolbar) {
      padding: 6px;
      gap: 2px;
    }

    .rich-editor :deep(.ql-toolbar .ql-formats) {
      margin-right: 4px;
      margin-bottom: 4px;
    }

    .rich-editor :deep(.ql-toolbar button) {
      width: 28px;
      height: 28px;
      padding: 3px;
    }

    .rich-editor :deep(.ql-toolbar .ql-picker) {
      font-size: 12px;
    }

    .rich-editor :deep(.ql-toolbar .ql-picker-label) {
      padding: 2px 4px;
    }
  }

  @media (max-width: 576px) {
    .rich-editor :deep(.ql-toolbar) {
      padding: 4px;
    }

    .rich-editor :deep(.ql-toolbar button) {
      width: 24px;
      height: 24px;
      padding: 2px;
    }

    .rich-editor :deep(.ql-toolbar .ql-picker) {
      font-size: 11px;
    }

    .rich-editor :deep(.ql-toolbar .ql-formats) {
      margin-right: 2px;
      margin-bottom: 2px;
    }

    .rich-editor :deep(.ql-editor) {
      min-height: 120px;
      font-size: 13px;
    }
  }
</style>
