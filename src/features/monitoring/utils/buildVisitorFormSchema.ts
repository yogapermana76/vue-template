import { z, type ZodTypeAny } from 'zod'
import type { TicketFormField } from '@/types/services'
import type { DynamicFieldValue } from '../components/detail/fields/types'

const CHOICE_TYPES = new Set(['radio', 'dropdown'])

/**
 * Build a per-field zod schema. Read-only fields skip validation (values are
 * preserved server-side); editable fields enforce required + regex + choice
 * membership as declared by the backend.
 */
const buildFieldSchema = (field: TicketFormField): ZodTypeAny => {
  if (!field.IsEditable) return z.any()

  if (field.HtmlType === 'bool') {
    return z.object({ value: z.string(), valueId: z.string() }).superRefine((val, ctx) => {
      const isChecked = val.value === 'true' || val.value === '1'
      if (field.IsRequired && !isChecked) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${field.Label} wajib disetujui`,
        })
      }
    })
  }

  if (field.HtmlType === 'checkbox') {
    return z.object({ value: z.string(), valueId: z.string() }).superRefine((val, ctx) => {
      const picked = val.valueId
        ? val.valueId
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        : []
      if (field.IsRequired && picked.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Pilih minimal satu ${field.Label}`,
        })
      }
    })
  }

  const isChoice = CHOICE_TYPES.has(field.HtmlType)
  const key = isChoice ? 'valueId' : 'value'

  let entry: ZodTypeAny = z.string()

  if (isChoice) {
    const allowed = (field.Data ?? []).map(opt => opt.id)
    if (allowed.length > 0) {
      entry = z.enum(allowed as [string, ...string[]], {
        errorMap: () => ({ message: `Pilih ${field.Label}` }),
      })
    }
  } else if (field.Validation?.regex) {
    entry = z.string().regex(new RegExp(field.Validation.regex), {
      message: `${field.Label} tidak valid`,
    })
  }

  if (field.IsRequired) {
    entry = entry.and(z.string().min(1, { message: `${field.Label} wajib diisi` }))
  } else {
    entry = entry.optional().or(z.literal(''))
  }

  return z.object({ value: z.string(), valueId: z.string() }).superRefine((val, ctx) => {
    const result = entry.safeParse(val[key])
    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error.issues[0]?.message ?? 'invalid',
      })
    }
  })
}

/**
 * Combine per-field schemas into one record schema whose keys are field names.
 * Returns a `.safeParse` result with per-field error messages the panel can
 * surface without knowing anything about the underlying rules.
 */
export const buildVisitorFormSchema = (fields: TicketFormField[]) => {
  const shape: Record<string, ZodTypeAny> = {}
  fields.forEach(f => {
    shape[f.Name] = buildFieldSchema(f)
  })
  return z.object(shape)
}

export const extractFieldErrors = (
  parsed: ReturnType<ReturnType<typeof buildVisitorFormSchema>['safeParse']>,
): Record<string, string> => {
  if (parsed.success) return {}
  const errors: Record<string, string> = {}
  for (const issue of parsed.error.issues) {
    const fieldName = String(issue.path[0] ?? '')
    if (fieldName && !errors[fieldName]) errors[fieldName] = issue.message
  }
  return errors
}

export type VisitorFormValues = Record<string, DynamicFieldValue>
