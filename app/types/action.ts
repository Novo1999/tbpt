export type Action = {
  type: 'add' | 'reorder' | 'delete' | 'edit'
  count?: number
  ids?: { delete: number[] }
}
