'use client'

import { isAuthAtom } from '@/app/[slug]/components/UserAccessModal'
import { Tab } from '@/app/[slug]/text/components/Tab'
import { ParsedText } from '@/app/types/text'
import { User } from '@/app/types/user'
import { Button } from '@/components/ui/button'
import { logout } from '@/lib/auth'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { atom, useAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useId } from 'react'
import { Descendant } from 'slate'
import TextEditor from './components/TextEditor'

export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  code?: boolean
}
export type CustomElement =
  | { type: 'heading-one'; children: Descendant[] }
  | { type: 'heading-two'; children: Descendant[] }
  | { type: 'paragraph'; children: Descendant[] }
  | { type: 'list-item'; children: Descendant[] }
  | { type: 'block-quote'; children: Descendant[] }

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

const tabsAtom = atom<ParsedText[]>([])
export const selectedTabAtom = atom<ParsedText>()

export const updateTabsAtom = atom(null, (get, set, update: ParsedText[] | ((prev: ParsedText[]) => ParsedText[])) => {
  const currentValue = get(tabsAtom)
  const newValue = typeof update === 'function' ? update(currentValue) : update
  set(tabsAtom, newValue)
})
const activeIdAtom = atom<number | null>()

const TextPage = () => {
  const { replace } = useRouter()
  const [activeId, setActiveId] = useAtom(activeIdAtom)
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthAtom)
  const [tabs, setTabs] = useAtom(tabsAtom)
  const [selectedTab, setSelectedTab] = useAtom(selectedTabAtom)
  const { slug } = useParams()

  const { data, isLoading } = useQuery<User>({
    queryKey: ['user', slug],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/texts/${slug}`)

        if (res.status === 401) {
          replace('/')
        }
        setIsAuthenticated(true)
        return res.json()
      } catch (error) {
        throw error
      }
    },
  })
  useEffect(() => {
    const texts = data?.texts || []
    const parsedTexts: ParsedText[] = texts.map((txt) => ({
      ...txt,
      content: JSON.parse(txt.content),
    }))
    if (texts.length > 0) {
      setTabs(parsedTexts)
      setSelectedTab(parsedTexts[0])
    }
  }, [data, setTabs, setSelectedTab])

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

  useEffect(() => {
    // if (!isAuthenticated) redirect(('/' + slug) as string)
  }, [isAuthenticated, slug])
  const remove = (item: ParsedText) => {
    if (item === selectedTab) {
      setSelectedTab(closestItem(tabs, item))
    }
    setTabs(removeItem(tabs, item))
  }
  const add = () => {
    setTabs((prev) => [
      ...prev,
      {
        id: 0,
        content: [
          {
            type: 'paragraph',
            children: [{ text: 'New item' }],
          },
        ],
        order: 0,
      },
    ])
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event

    setActiveId(Number(active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setTabs((items) => {
        const oldIndex = items.findIndex((item) => item.id === Number(active.id))
        const newIndex = items.findIndex((item) => item.id === Number(over?.id))
        return arrayMove(items, oldIndex, newIndex)
      })
      setActiveId(null)
    }
  }
  const id = useId()

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className={`${isAuthenticated ? 'opacity-100' : 'opacity-0'} `}>
      <nav className="flex justify-between flex-col sm:flex-row p-4">
        <h1 className="text-5xl font-bold mb-4">
          T<small className="text-lg">he</small> B<small className="text-lg">etter</small> P<small className="text-lg">rotected</small> T<small className="text-lg">ext</small>{' '}
        </h1>
        <div className="flex gap-2">
          <Button>Reload</Button>
          <Button>Save</Button>
          <Button>Change Password</Button>
          <Button variant="destructive">Delete</Button>
          <Button
            onClick={async () => {
              await logout()
              replace('/')
            }}
          >
            Log Out
          </Button>
        </div>
      </nav>
      <div className="window">
        <nav className="flex justify-between flex-wrap items-center mx-4">
          <div className="flex flex-wrap">
            <DndContext id={id} sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
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

        <main className="mx-4 pt-4">
          <AnimatePresence mode="wait">
            <motion.div key={selectedTab ? selectedTab.id : 'empty'} animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.15 }}>
              <TextEditor />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
export default TextPage
