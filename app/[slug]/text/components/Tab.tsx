import { TextTab } from '@/app/[slug]/text/page'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface Props {
  item?: TextTab
  isSelected?: boolean
  onClick?: () => void
  onRemove?: () => void
}

export const Tab = ({ item, onClick, onRemove, isSelected }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item?.id || '' })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-pointer">
      <motion.div
        layout
        className={`flex items-center justify-between gap-2 border-b border-r p-2 rounded-b transition-colors duration-200 ${isSelected ? 'bg-gray-100' : 'bg-white'}`}
        onClick={onClick}
      >
        <span className="truncate max-w-[80px] text-sm">{item?.text.slice(0, 10)}...</span>
        <button
          className="text-gray-500 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  )
}
