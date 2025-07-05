'use client'
import { selectedTabAtom, updateTabsAtom } from '@/app/[slug]/text/page'
import { useAtomValue, useSetAtom } from 'jotai'
import { CSSProperties, KeyboardEvent, useCallback, useEffect, useState } from 'react'
import { BaseEditor, createEditor, Descendant, Editor, Element, Transforms } from 'slate'
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react'

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
  return <div {...props.attributes}>{props.children}</div>
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

const TextEditor = () => {
  const [editor] = useState(() => withReact(createEditor()))
  const updateTabs = useSetAtom(updateTabsAtom)
  const tab = useAtomValue(selectedTabAtom)

  // Fix: Proper state update logic
  const handleEditorChange = useCallback(
    (newValue: Descendant[]) => {
      updateTabs((prev) => {
        // Fix: Return a new array with updated tab
        return prev.map((prevTab) => {
          if (prevTab.id === tab?.id) {
            return { ...prevTab, content: newValue } // Return new object
          }
          return prevTab
        })
      })
    },
    [updateTabs, tab?.id]
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
        Transforms.setNodes(editor, { type: match ? 'paragraph' : 'code' }, { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) })
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

  useEffect(() => {
    if (!editor) return
    if (tab) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        ReactEditor.focus(editor)
        if (editor && editor.children && editor.children.length > 0) Transforms.select(editor, Editor.end(editor, []))
      }, 50)
    }
  }, [tab?.id, editor, tab])

  return (
    <Slate editor={editor} initialValue={tab?.content || []} onChange={handleEditorChange}>
      <Editable renderLeaf={renderLeaf} renderElement={renderEl} onKeyDown={handleKeyDown} className="border p-4 rounded-lg" />
    </Slate>
  )
}

export default TextEditor
