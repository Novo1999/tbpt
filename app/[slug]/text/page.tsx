'use client'

import { isAuthAtom } from '@/app/[slug]/components/UserAccessModal'
import { Tab } from '@/app/[slug]/text/components/Tab'
import { Button } from '@/components/ui/button'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { AnimatePresence, motion } from 'framer-motion'
import { atom, useAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export type TextTab = {
  id: string
  text: string
}
export const dummyTextTabs: TextTab[] = [
  { id: 'intro', text: 'Welcome to the platform! Here’s a quick overview.' },
  { id: 'features', text: 'Our app includes powerful tools for productivity.' },
  { id: 'support', text: 'Need help? Contact our support team anytime.' },
  { id: 'terms', text: 'Please read and agree to our terms and conditions.' },
  { id: 'privacy', text: 'Your data is safe. Read our privacy policy.' },
]

export function removeItem<T>([...arr]: T[], item: T) {
  const index = arr.indexOf(item)
  if (index > -1) arr.splice(index, 1)
  return arr
}

export function closestItem<T>(arr: T[], item: T) {
  const index = arr.indexOf(item)
  if (index === -1) {
    return arr[0]
  } else if (index === arr.length - 1) {
    return arr[arr.length - 2]
  } else {
    return arr[index + 1]
  }
}

const tabsAtom = atom<TextTab[]>(dummyTextTabs)
const selectedTabAtom = atom<TextTab>()
const activeIdAtom = atom<string | null>('')

const TextPage = () => {
  const [activeId, setActiveId] = useAtom(activeIdAtom)
  const [isAuthenticated] = useAtom(isAuthAtom)
  const [tabs, setTabs] = useAtom(tabsAtom)
  const [selectedTab, setSelectedTab] = useAtom(selectedTabAtom)
  console.log('🚀 ~ TextPage ~ selectedTab:', selectedTab)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const { slug } = useParams()

  useEffect(() => {
    // if (!isAuthenticated) redirect(('/' + slug) as string)
  }, [isAuthenticated, slug])
  const remove = (item: TextTab) => {
    if (item === selectedTab) {
      setSelectedTab(closestItem(tabs, item))
    }

    setTabs(removeItem(tabs, item))
  }
  const add = () => {
    console.log(2)
    setTabs((prev) => [...prev, { id: crypto.randomUUID(), text: 'New item' }])
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event

    setActiveId(active.id.toString())
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setTabs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
      setActiveId(null)
    }
  }
  return (
    <div>
      <nav className="flex justify-between flex-col sm:flex-row p-4">
        <h1 className="text-5xl font-bold mb-4">
          T<small className="text-lg">he</small> B<small className="text-lg">etter</small> P<small className="text-lg">rotected</small> T<small className="text-lg">ext</small>{' '}
        </h1>
        <div className="flex gap-2">
          <Button>Reload</Button>
          <Button>Save</Button>
          <Button>Change Password</Button>
          <Button>Delete</Button>
        </div>
      </nav>
      <div className="window">
        <nav className="flex justify-between flex-wrap items-center mx-4">
          <div className="flex flex-wrap">
            <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
              <SortableContext items={tabs.map((item) => item.id)} strategy={rectSortingStrategy}>
                {tabs.map((item) => (
                  <Tab onRemove={() => remove(item)} key={item.id} item={item} isSelected={selectedTab?.id === item.id} onClick={() => setSelectedTab(item)} />
                ))}
              </SortableContext>
              <DragOverlay>{activeId ? <Tab item={tabs.find((tab) => tab.id === activeId)} /> : null}</DragOverlay>
            </DndContext>
          </div>
          <motion.button onClick={add} className="rounded-lg border p-2 ml-2" whileTap={{ scale: 0.9 }}>
            <Plus />
          </motion.button>
        </nav>

        <main>
          <AnimatePresence mode="wait">
            <motion.div key={selectedTab ? selectedTab.id : 'empty'} animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.15 }}>
              {selectedTab ? selectedTab.id : '😋'}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
export default TextPage
