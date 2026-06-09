<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { ref, computed } from 'vue'
  import type Quill from 'quill'
  import { FormField } from '@/components/ui/form'
  import RichEditor from './RichEditor.vue'

  type QuillToolbarConfig = string | string[][] | object

  interface Props {
    class?: HTMLAttributes['class']
    /** V-model value - can be HTML string, text string, or Delta object */
    modelValue?: string | object
    /** Content type: 'html', 'text', or 'delta' */
    contentType?: 'html' | 'text' | 'delta'
    /** Label text */
    label?: string
    /** For attribute to link label to editor */
    for?: string
    /** Show required indicator (*) */
    required?: boolean
    /** Helper/description text */
    helper?: string
    /** Error message (overrides helper when present) */
    error?: string | string[]
    /** Right-side footer text */
    footerRight?: string
    /** Disabled state */
    disabled?: boolean
    /** Placeholder text */
    placeholder?: string
    /** Read-only state */
    readOnly?: boolean
    /** Invalid/error state (optional, auto-detected from error prop) */
    invalid?: boolean
    /** Toolbar configuration - string, array, or object. Set to empty string to hide */
    toolbar?: QuillToolbarConfig
    /** Quill theme */
    theme?: string
    /** Additional Quill modules */
    modules?: Record<string, unknown>
    /** Allowed formats */
    formats?: string[]
    /** Show character count */
    showCharacterCount?: boolean
    /** Maximum character length */
    maxLength?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    contentType: 'html',
    required: false,
    disabled: false,
    placeholder: '',
    readOnly: false,
    invalid: false,
    theme: 'snow',
    showCharacterCount: false,
    maxLength: 0,
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
  const editorRef = ref<InstanceType<typeof RichEditor> | null>(null)
  const currentCharCount = ref(0)

  // Computed
  const content = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  const characterCountText = computed(() => {
    if (!props.showCharacterCount) return undefined

    if (props.maxLength > 0) {
      return `${currentCharCount.value} / ${props.maxLength}`
    }
    return `${currentCharCount.value}`
  })

  const isOverLimit = computed(() => {
    return props.maxLength > 0 && currentCharCount.value > props.maxLength
  })

  const errorMessage = computed(() => {
    if (isOverLimit.value) {
      return `Character count exceeds maximum limit of ${props.maxLength}`
    }
    return props.error
  })

  // Determine if editor has error
  const hasError = computed(() => {
    if (Array.isArray(props.error)) return props.error.length > 0
    return !!props.error
  })

  // Only pass toolbar, modules, formats if they are defined
  const editorProps = computed(() => {
    const dynamicProps: Record<string, unknown> = {}

    if (props.toolbar !== undefined) {
      dynamicProps.toolbar = props.toolbar
    }

    if (props.modules) {
      dynamicProps.modules = props.modules
    }

    if (props.formats) {
      dynamicProps.formats = props.formats
    }

    // Pass invalid state - from explicit prop or auto-detected from error
    if (props.invalid || hasError.value || isOverLimit.value) {
      dynamicProps.invalid = true
    }

    return dynamicProps
  })

  // Methods
  const updateCharacterCount = () => {
    if (!props.showCharacterCount || !editorRef.value) {
      currentCharCount.value = 0
      return
    }

    const text = editorRef.value.getText()
    // Remove trailing newline that Quill always adds
    const trimmedText = text.replace(/\n$/, '')
    currentCharCount.value = trimmedText.length
  }

  const focus = () => {
    if (editorRef.value) {
      editorRef.value.focus()
    }
  }

  const blur = () => {
    if (editorRef.value) {
      editorRef.value.blur()
    }
  }

  const getQuillInstance = (): Quill | null => {
    return editorRef.value?.getQuillInstance() || null
  }

  const getHTML = (): string => {
    return editorRef.value?.getHTML() || ''
  }

  const getText = (): string => {
    return editorRef.value?.getText() || ''
  }

  const getDelta = () => {
    return editorRef.value?.getDelta() || null
  }

  const setContents = (delta: unknown) => {
    if (editorRef.value) {
      editorRef.value.setContents(delta)
    }
  }

  const setHTML = (html: string) => {
    if (editorRef.value) {
      editorRef.value.setHTML(html)
    }
  }

  const setText = (text: string) => {
    if (editorRef.value) {
      editorRef.value.setText(text)
    }
  }

  const isEmpty = (): boolean => {
    return editorRef.value?.isEmpty() ?? true
  }

  const clear = () => {
    if (editorRef.value) {
      editorRef.value.clear()
    }
    updateCharacterCount()
  }

  // Event handlers
  const handleTextChange = (...args: unknown[]) => {
    updateCharacterCount()
    emit('text-change', ...args)
  }

  const handleSelectionChange = (...args: unknown[]) => {
    emit('selection-change', ...args)
  }

  const handleEditorChange = (...args: unknown[]) => {
    emit('editor-change', ...args)
  }

  const handleFocus = (event: FocusEvent) => {
    emit('focus', event)
  }

  const handleBlur = (event: FocusEvent) => {
    emit('blur', event)
  }

  const handleReady = (quill: Quill) => {
    updateCharacterCount()
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

<template>
  <FormField
    :class="props.class"
    :label="label"
    :for="props.for"
    :required="required"
    :helper="helper"
    :error="errorMessage"
    :footer-right="characterCountText"
    :disabled="disabled"
  >
    <RichEditor
      ref="editorRef"
      v-model="content"
      :content-type="contentType"
      :placeholder="placeholder"
      :disabled="disabled"
      :read-only="readOnly"
      :theme="theme"
      v-bind="editorProps"
      @text-change="handleTextChange"
      @selection-change="handleSelectionChange"
      @editor-change="handleEditorChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @ready="handleReady"
    />
  </FormField>
</template>
