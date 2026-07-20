import { computed, ref, watch, type Ref } from 'vue'
import { useEditVisitor, useTicketForm } from '@/composables/services'
import type { TicketFormField } from '@/types/services'
import type { DynamicFieldValue } from '../components/detail/fields/types'
import {
  buildVisitorFormSchema,
  extractFieldErrors,
  type VisitorFormValues,
} from '../utils/buildVisitorFormSchema'

interface Options {
  programId: Ref<number | undefined>
  code: Ref<string | undefined>
  enabled: Ref<boolean>
}

export type VisitorFormStatus = 'loading' | 'error' | 'empty' | 'ready'

/**
 * Manages the visitor-edit form:
 * - Fetches schema via `useTicketForm`
 * - Hydrates a mutable model from server values
 * - Delegates validation to the zod schema in `buildVisitorFormSchema`
 * - Submits only fields whose value/valueId changed
 * - Exposes a single `status` for the panel to switch on
 */
export function useTicketVisitorForm({ programId, code, enabled }: Options) {
  const query = useTicketForm({
    params: { programId, code },
    options: { enabled },
  })

  const fields = computed<TicketFormField[]>(() => query.data.value?.data ?? [])

  const model = ref<VisitorFormValues>({})
  const errors = ref<Record<string, string>>({})

  const hydrate = (source: TicketFormField[]) => {
    const next: VisitorFormValues = {}
    source.forEach(f => {
      next[f.Name] = { value: f.Value, valueId: f.ValueId }
    })
    model.value = next
    errors.value = {}
  }

  watch(fields, hydrate, { immediate: true })

  const setField = (name: string, next: DynamicFieldValue) => {
    model.value = { ...model.value, [name]: next }
    if (errors.value[name]) {
      const { [name]: _, ...rest } = errors.value
      errors.value = rest
    }
  }

  const status = computed<VisitorFormStatus>(() => {
    if (query.isLoading.value) return 'loading'
    if (query.error.value) return 'error'
    if (fields.value.length === 0) return 'empty'
    return 'ready'
  })

  const hasEditableFields = computed(() => fields.value.some(f => f.IsEditable))

  const isDirty = computed(() =>
    fields.value.some(f => {
      const current = model.value[f.Name]
      if (!current) return false
      return current.value !== f.Value || current.valueId !== f.ValueId
    }),
  )

  const mutation = useEditVisitor()

  const submit = async (): Promise<boolean> => {
    if (!code.value) return false

    const parsed = buildVisitorFormSchema(fields.value).safeParse(model.value)
    if (!parsed.success) {
      errors.value = extractFieldErrors(fields.value, parsed)
      return false
    }
    errors.value = {}

    const dirtyPayload = fields.value
      .filter(f => {
        if (!f.IsEditable) return false
        const current = model.value[f.Name]
        return current && (current.value !== f.Value || current.valueId !== f.ValueId)
      })
      .map(f => ({
        name: f.Name,
        value: model.value[f.Name].value,
        valueId: model.value[f.Name].valueId,
      }))

    if (dirtyPayload.length === 0) return true
    await mutation.mutateAsync({ code: code.value, fields: dirtyPayload })
    await query.refetch()
    return true
  }

  return {
    status,
    fields,
    model,
    errors,
    isDirty,
    hasEditableFields,
    isSubmitting: computed(() => mutation.isPending.value),
    setField,
    submit,
    reset: () => hydrate(fields.value),
  }
}
