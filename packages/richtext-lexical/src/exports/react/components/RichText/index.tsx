import type { SerializedEditorState } from 'lexical'

import React from 'react'

import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '../../../../nodeTypes.js'
import type { JSXConverters } from './converter/types.js'

import { defaultJSXConverters } from './converter/defaultConverters.js'
import { convertLexicalToJSX } from './converter/index.js'
import './index.css'

export type JSXConvertersFunction<
  T extends { [key: string]: any; type?: string } =
    | DefaultNodeTypes
    | SerializedBlockNode<{ blockName?: null | string; blockType: string }>
    | SerializedInlineBlockNode<{ blockName?: null | string; blockType: string }>,
> = (args: { defaultConverters: JSXConverters<DefaultNodeTypes> }) => JSXConverters<T>

type Props = {
  className?: string
  converters?: JSXConverters | JSXConvertersFunction
  data: SerializedEditorState
  disableIndent?: boolean | string[]
  disableTextAlign?: boolean | string[]
}

export const RichText: React.FC<Props> = ({
  className,
  converters,
  data: editorState,
  disableIndent,
  disableTextAlign,
}) => {
  if (!editorState) {
    return null
  }

  let finalConverters: JSXConverters = {}
  if (converters) {
    if (typeof converters === 'function') {
      finalConverters = converters({ defaultConverters: defaultJSXConverters })
    } else {
      finalConverters = converters
    }
  } else {
    finalConverters = defaultJSXConverters
  }

  return (
    <div className={className ?? 'payload-richtext'}>
      {editorState &&
        !Array.isArray(editorState) &&
        typeof editorState === 'object' &&
        'root' in editorState &&
        convertLexicalToJSX({
          converters: finalConverters,
          data: editorState,
          disableIndent,
          disableTextAlign,
        })}
    </div>
  )
}
