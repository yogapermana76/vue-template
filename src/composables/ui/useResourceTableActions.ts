import { computed, type Ref } from 'vue'
import { Eye, Pencil, Trash2 } from 'lucide-vue-next'
import type { TableAction } from '@/components/ui/table'
import type { ConfirmDialogButton } from '@/components/ui/dialog/composite'

/**
 * Per-row handlers. Omit any of `view`/`edit`/`delete` to skip that
 * action; can point at routing, dialogs, or mutations interchangeably.
 */
interface RowActionHandlers<T> {
  view?: (row: T) => void
  edit?: (row: T) => void
  delete?: (row: T) => void
}

interface UseResourceTableActionsOptions<T> {
  handlers: RowActionHandlers<T>
  /** Override default English labels; pass e.g. `confirmDelete: 'Delete invoice'`. */
  labels?: {
    view?: string
    edit?: string
    delete?: string
    cancel?: string
    confirmDelete?: string
    deleting?: string
  }
  /** Reactive loading flag for the delete confirmation button. */
  deleting: Ref<boolean>
  /** Handler for the "Delete" confirmation button. */
  onConfirmDelete: () => void | Promise<void>
  /** Handler for the "Cancel" button on the confirm dialog. */
  onCancelDelete: () => void
}

/**
 * Row actions (view/edit/delete) + delete-confirmation buttons for
 * resource-index pages. Consolidates copy so labels don't drift.
 */
export function useResourceTableActions<T>(options: UseResourceTableActionsOptions<T>) {
  const { handlers, labels, onConfirmDelete, onCancelDelete, deleting } = options

  const l = {
    view: labels?.view ?? 'View detail',
    edit: labels?.edit ?? 'Edit',
    delete: labels?.delete ?? 'Delete',
    cancel: labels?.cancel ?? 'Cancel',
    confirmDelete: labels?.confirmDelete ?? 'Delete',
    deleting: labels?.deleting ?? 'Deleting…',
  }

  const rowActions = (row: T): TableAction[] => {
    const actions: TableAction[] = []
    if (handlers.view) {
      actions.push({
        key: 'view',
        label: l.view,
        icon: Eye,
        onClick: () => handlers.view!(row),
      })
    }
    if (handlers.edit) {
      actions.push({
        key: 'edit',
        label: l.edit,
        icon: Pencil,
        onClick: () => handlers.edit!(row),
      })
    }
    if (handlers.delete) {
      actions.push({
        key: 'delete',
        label: l.delete,
        icon: Trash2,
        variant: 'destructive',
        onClick: () => handlers.delete!(row),
        separator: true,
      })
    }
    return actions
  }

  const deleteButtons = computed<ConfirmDialogButton[]>(() => [
    {
      label: l.cancel,
      variant: 'secondary',
      disabled: deleting.value,
      onClick: onCancelDelete,
    },
    {
      label: deleting.value ? l.deleting : l.confirmDelete,
      // ConfirmDialog uses 'danger'; TableAction uses 'destructive' — don't mix them up.
      variant: 'danger',
      loading: deleting.value,
      onClick: onConfirmDelete,
    },
  ])

  return { rowActions, deleteButtons }
}
