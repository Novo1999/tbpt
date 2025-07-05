'use client'

import LoadingOverlay from '@/app/[slug]/components/shared/LoadingOverlay'
import { isAuthAtom } from '@/app/[slug]/components/UserAccessModal'
import { actionsAtom, activeIdAtom, selectedTabAtom, tabsAtom, updateActionsAtom, updateTabsAtom } from '@/app/[slug]/text/atoms/textAtoms'
import { Tab } from '@/app/[slug]/text/components/Tab'
import { ParsedText, RawText, Text } from '@/app/types/text'
import { User } from '@/app/types/user'
import { Button } from '@/components/ui/button'
import { getLastItem } from '@/lib/array-util'
import { logout } from '@/lib/auth'
import { closestItem, removeItem } from '@/lib/dnd-util'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useId } from 'react'
import TextEditor from './components/TextEditor'

const TextPage = () => {
  const { replace } = useRouter()
  const [activeId, setActiveId] = useAtom(activeIdAtom)
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthAtom)
  const tabs = useAtomValue(tabsAtom)
  const [selectedTab, setSelectedTab] = useAtom(selectedTabAtom)
  const { slug } = useParams()
  const updateTabs = useSetAtom(updateTabsAtom)
  const actions = useAtomValue(actionsAtom)
  const updateActions = useSetAtom(updateActionsAtom)

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

  const { mutate: addTextMutate, isPending: isAddTextPending } = useMutation({
    mutationFn: async (textBody: ParsedText) => {
      try {
        const res = await fetch(`/api/texts/${slug}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(textBody),
        })
        console.log(res)
      } catch (error) {
        throw error
      }
    },
  })

  const handleAddTextMutation = (textBody: ParsedText) => {
    addTextMutate(textBody)
  }

  const handleSaveMyData = () => {
    const hasAddAction = actions.find((action) => action.type === 'add')
    if (hasAddAction) {
      const newTextBodies = tabs.filter((tab) => !!tab.isNew)
      console.log('🚀 ~ handleSaveMyData ~ newTextBodies:', newTextBodies)
      newTextBodies.forEach(({ isNew, ...body }) => handleAddTextMutation(body))
    }
  }

  useEffect(() => {
    const texts = data?.texts || []
    const parsedTexts: ParsedText[] = texts.map((txt) => ({
      ...txt,
      content: JSON.parse(txt.content),
    }))
    if (texts.length > 0) {
      updateTabs(parsedTexts)
      setSelectedTab(parsedTexts[0])
    }
  }, [data, updateTabs, setSelectedTab])

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
    updateTabs(removeItem(tabs, item))

    // find the action with type 'add'
    // then if the count of it is 1, filter those with type 'add'
    // if the count of it is more than 1, decrement the count by 1
    // check if item id is 0
    // add an action with type 'delete' , count 1(if delete does not exist)
    // increment count of delete action by 1 if exists
    updateActions((prev) => {
      if (!item.isNew) {
        const deleteAction = prev.find((action) => action.type === 'delete')
        if ((deleteAction?.count || 0) >= 1) {
          const update = [...prev]
          prev = update.map((action) => (action.type === 'delete' ? { ...action, count: (deleteAction?.count || 0) + 1 } : action))
        } else {
          prev = [...prev, { type: 'delete', count: 1 }]
        }
      } else {
        const addAction = prev.find((action) => action.type === 'add')
        if (addAction?.count === 1) prev = prev.filter((action) => action.type !== 'add')
        if ((addAction?.count || 0) > 1) prev = prev.map((action) => (action.type === 'add' ? { ...action, count: (addAction?.count || 0) - 1 } : action))
      }

      return prev
    })
  }

  const add = () => {
    const newTab: ParsedText = {
      id: getLastItem<ParsedText>(tabs).id + 1,
      content: [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ],
      userId: data?.id,
      order: getLastItem<ParsedText>(tabs).order + 1,
      isNew: true,
    }

    updateTabs((prev) => [...prev, newTab])

    setSelectedTab(newTab)
    updateActions((prev) => {
      if (prev.length > 0) {
        return prev.map((action) =>
          action.type === 'add'
            ? {
                ...action,
                count: (action?.count || 0) + 1,
              }
            : action
        )
      } else {
        return [...prev, { type: 'add', count: 1 }]
      }
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event

    setActiveId(Number(active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      updateTabs((items) => {
        const oldIndex = items.findIndex((item) => item.id === Number(active.id))
        const newIndex = items.findIndex((item) => item.id === Number(over?.id))
        return arrayMove(items, oldIndex, newIndex)
      })
      setActiveId(null)
    }
  }

  const id = useId()

  return isLoading ? (
    <LoadingOverlay />
  ) : (
    <div className={`${isAuthenticated ? 'opacity-100' : 'opacity-0'} `}>
      <nav className="flex justify-between flex-col sm:flex-row p-4">
        <h1 className="text-5xl font-bold mb-4">
          T<small className="text-lg">he</small> B<small className="text-lg">etter</small> P<small className="text-lg">rotected</small> T<small className="text-lg">ext</small>{' '}
        </h1>
        <div className="flex gap-2">
          <Button>Reload</Button>
          <Button onClick={handleSaveMyData} disabled={!tabs.length}>
            Save
          </Button>
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
              <DragOverlay>{activeId ? <Tab item={tabs.find((tab) => tab.id.toString() === activeId.toString())} /> : null}</DragOverlay>
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
