import { Action } from '@/app/types/action'
import { ParsedText } from '@/app/types/text'
import { atom } from 'jotai'

const tabsAtom = atom<ParsedText[]>([])
const selectedTabAtom = atom<ParsedText>()

const updateTabsAtom = atom(null, (get, set, update: ParsedText[] | ((prev: ParsedText[]) => ParsedText[])) => {
  const currentValue = get(tabsAtom)
  const newValue = typeof update === 'function' ? update(currentValue) : update
  set(tabsAtom, newValue)
})

const actionsAtom = atom<Action[]>([])
const updateActionsAtom = atom([], (get, set, update: Action[] | ((prev: Action[]) => Action[])) => {
  const currentValue = get(actionsAtom)
  const newValue = typeof update === 'function' ? update(currentValue) : update
  set(actionsAtom, newValue)
})

const activeIdAtom = atom<number | null>()

export { actionsAtom, activeIdAtom, selectedTabAtom, tabsAtom, updateActionsAtom, updateTabsAtom }
