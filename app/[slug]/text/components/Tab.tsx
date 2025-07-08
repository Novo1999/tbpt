import { ParsedText } from '@/app/types/text'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'

interface Props {
  item?: ParsedText
  isSelected?: boolean
  onClick?: () => void
  onRemove?: () => void
}

export const Tab = ({ item, onClick, onRemove, isSelected }: Props) => {
  const [tabText, setTabText] = useState('')
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item?.id || '' })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // useEffect(() => {
  //   const editor = document.querySelector(`[data-editor-tab="${item?.id}"]`)
  //   if (editor) {
  //     console.log('🚀 ~ useEffect ~ editor:', editor)
  //     const slateString = editor?.querySelector(
  //       '[data-slate-string="true"]'
  //     )?.textContent
  //     setTabText(slateString || '')
  //   }
  // }, [item])

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='cursor-pointer'
    >
      <motion.div
        layout
        className={`flex items-center justify-between gap-2 border-b border-r p-2 rounded-b transition-colors duration-200 ${
          isSelected ? 'bg-gray-100' : 'bg-white'
        }`}
        onClick={onClick}
      >
        {/* <span className='truncate max-w-[80px] text-sm'>{tabText}...</span> */}
        <span className='truncate max-w-[80px] text-sm'>
          {item?.content?.[0]?.children?.[0]?.text || 'Text Content' + '...'}
        </span>
        <button
          className='text-gray-500 hover:text-red-500'
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
        >
          <X className='w-4 h-4' />
        </button>
      </motion.div>
    </div>
  )
}
