'use client'
import { SetStateAction } from 'jotai'
import { CSSProperties, KeyboardEvent, useCallback, useState } from 'react'
import {
  BaseEditor,
  createEditor,
  Descendant,
  Editor,
  Element,
  Transforms,
} from 'slate'
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react'

interface TextTab {
  id: string
  text: Descendant[]
}

type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result

type CustomElement = {
  type: string
  children: Descendant[]
}

type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

const CodeElement = (props: RenderElementProps) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>
}

const Leaf = (props: RenderLeafProps) => {
  const leafStyle: CSSProperties = {}

  if (props.leaf.bold) {
    leafStyle.fontWeight = 'bold'
  }

  if (props.leaf.italic) {
    leafStyle.fontStyle = 'italic'
  }

  return (
    <span {...props.attributes} style={leafStyle}>
      {props.children}
    </span>
  )
}

const TextEditor = ({
  tab,
  setTabs,
}: {
  tab: TextTab
  setTabs: SetAtom<[SetStateAction<TextTab[]>], void>
}) => {
  const [editor] = useState(() => withReact(createEditor()))

  // Fix: Proper state update logic
  const handleEditorChange = useCallback(
    (newValue: Descendant[]) => {
      setTabs((prev) => {
        // Fix: Return a new array with updated tab
        return prev.map((prevTab) => {
          if (prevTab.id === tab.id) {
            return { ...prevTab, text: newValue } // Return new object
          }
          return prevTab
        })
      })
    },
    [setTabs, tab.id]
  )

  const renderEl = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />
  }, [])

  // Fix: Add Ctrl/Cmd key checks for shortcuts
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) return // Only handle Ctrl/Cmd shortcuts

    switch (event.key) {
      case '`': {
        event.preventDefault()
        const [match] = Editor.nodes(editor, {
          match: (n) => Element.isElement(n) && n.type === 'code',
        })
        Transforms.setNodes(
          editor,
          { type: match ? 'paragraph' : 'code' },
          { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
        )
        break
      }
      case 'b': {
        event.preventDefault()
        const editorMarks = Editor.marks(editor)
        if (editorMarks?.bold) {
          Editor.removeMark(editor, 'bold')
        } else {
          Editor.addMark(editor, 'bold', true)
        }
        break
      }
      case 'i': {
        event.preventDefault()
        const editorMarks = Editor.marks(editor)
        if (editorMarks?.italic) {
          Editor.removeMark(editor, 'italic')
        } else {
          Editor.addMark(editor, 'italic', true)
        }
        break
      }
    }
  }

  return (
    <Slate
      editor={editor}
      initialValue={tab.text}
      onChange={handleEditorChange}
    >
      <Editable
        renderLeaf={renderLeaf}
        renderElement={renderEl}
        onKeyDown={handleKeyDown}
        className='border p-4 rounded-lg'
      />
    </Slate>
  )
}

export default TextEditor
