import React, { TextareaHTMLAttributes, useEffect, useRef } from 'react'
import EasyMde from 'easymde'
import styled from 'styled-components'
import merge from 'lodash/merge'

import 'easymde/dist/easymde.min.css'

interface SimpleMdeProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  options?: EasyMde.Options
  onTextChange: (value: string) => void
}

const Wrapper = styled.div`
  .EasyMDEContainer .CodeMirror {
    background: unset;
    border-color: ${({ theme }) => theme.colors.border};
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    box-shadow: ${({ theme }) => theme.shadows.inset};
    padding: 16px;
  }

  .CodeMirror-code {
    color: ${({ theme }) => theme.colors.text};
  }

  .CodeMirror-wrap .CodeMirror-cursor {
    border-left: 1px solid ${({ theme }) => theme.colors.text};
  }

  .editor-toolbar {
    background: #979797;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    color: ${({ theme }) => theme.colors.text};

    a,
    button {
      color: ${({ theme }) => theme.colors.text};

      &:hover,
      &.active {
        background: ${({ theme }) => theme.colors.background};
        border: 0;
      }
    }
  }
`

const TextStyled = styled.textarea`
  .CodeMirror-cursors {
    border-left: 2px solid ${({ theme }) => theme.colors.text};
  }
`  

/**
 * @see https://github.com/Ionaru/easy-markdown-editor#configuration
 */

const defaultOptions: EasyMde.Options = {
  autofocus: false,
  status: false,
  hideIcons: ['guide', 'fullscreen', 'preview', 'side-by-side'],
  spellChecker: false,
  styleSelectedText: true,
  theme:'red',
}

const SimpleMde: React.FC<SimpleMdeProps> = ({ options, onTextChange, ...props }) => {
  const ref = useRef()
  const onTextChangeHandler = useRef(onTextChange)

  useEffect(() => {
    let simpleMde = new EasyMde(merge({ element: ref.current }, defaultOptions, options))

    simpleMde.codemirror.on('change', () => {
      onTextChangeHandler.current(simpleMde.value())
    })

    return () => {
      if (simpleMde) {
        simpleMde.toTextArea()
        simpleMde = null
      }
    }
  }, [options, onTextChangeHandler, ref])

  return (
    <Wrapper>
      <textarea ref={ref} readOnly {...props} />
    </Wrapper>
  )
}

export default SimpleMde
