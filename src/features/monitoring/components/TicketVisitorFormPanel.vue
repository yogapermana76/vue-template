<script setup lang="ts">
  import { toRef } from 'vue'
  import { AlertCircle } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Spinner } from '@/components/ui/spinner'
  import { EmptyState } from '@/components/ui/empty-state'
  import { useTicketVisitorForm } from '../composables/useTicketVisitorForm'
  import DynamicFormField from './detail/DynamicFormField.vue'

  const props = defineProps<{
    programId: number | undefined
    code: string | undefined
    active: boolean
  }>()

  const emit = defineEmits<{ saved: [] }>()

  const form = useTicketVisitorForm({
    programId: toRef(props, 'programId'),
    code: toRef(props, 'code'),
    enabled: toRef(props, 'active'),
  })

  const onSubmit = async () => {
    const ok = await form.submit().catch(() => false)
    if (ok && !form.isDirty.value) emit('saved')
  }
</script>

<template>
  <div class="flex flex-col">
    <div
      v-if="form.status.value === 'loading'"
      class="flex min-h-64 flex-col items-center justify-center gap-3 py-10"
    >
      <Spinner size="lg" tone="primary" />
      <p class="body-caption text-neutral-500">Memuat formulir...</p>
    </div>

    <EmptyState
      v-else-if="form.status.value === 'error'"
      :icon="AlertCircle"
      title="Gagal memuat formulir"
      description="Coba tutup panel ini dan buka kembali."
      class="py-8"
    />

    <EmptyState
      v-else-if="form.status.value === 'empty'"
      :icon="AlertCircle"
      title="Formulir tidak tersedia"
      description="Tidak ada data formulir untuk tiket ini."
      class="py-8"
    />

    <form v-else class="flex flex-col gap-5 px-6 py-5" @submit.prevent="onSubmit">
      <DynamicFormField
        v-for="field in form.fields.value"
        :key="field.Name"
        :field="field"
        :model-value="form.model.value[field.Name]"
        :error="form.errors.value[field.Name]"
        @update:model-value="v => form.setField(field.Name, v)"
      />

      <div
        class="sticky bottom-0 -mx-6 -mb-5 flex items-center justify-end gap-2 border-t border-neutral-200 bg-white px-6 py-4"
      >
        <Button
          type="button"
          variant="secondary"
          :disabled="form.isSubmitting.value || !form.isDirty.value"
          @click="form.reset"
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant="primary"
          :loading="form.isSubmitting.value"
          :disabled="!form.hasEditableFields.value || !form.isDirty.value"
        >
          Simpan Perubahan
        </Button>
      </div>
    </form>
  </div>
</template>
