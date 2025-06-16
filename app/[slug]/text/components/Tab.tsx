import { TextTab } from '@/app/[slug]/text/page'
import { motion, Reorder } from 'framer-motion'
import { X } from 'lucide-react'
import * as React from 'react'

interface Props {
  item: TextTab
  isSelected: boolean
  onClick: () => void
  onRemove: () => void
}

export const Tab = ({ item, onClick, onRemove, isSelected }: Props) => {
  return (
    <Reorder.Item
      value={item}
      id={item.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.15 } }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
      whileDrag={{ backgroundColor: '#e3e3e3' }}
      className="cursor-pointer"
    >
      <motion.div
        layout
        className={`flex items-center justify-between gap-2 border-b border-r p-2 rounded-b transition-colors duration-200 ${isSelected ? 'bg-gray-100' : 'bg-white'}`}
        onClick={onClick}
      >
        <span className="truncate max-w-[80px] text-sm">{item.text.slice(0, 10)}...</span>
        <button
          className="text-gray-500 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </Reorder.Item>
  )
}
