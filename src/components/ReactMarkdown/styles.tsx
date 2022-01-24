/* eslint-disable no-nested-ternary */
import React from 'react'
import { Heading } from '@fingerlabs/definixswap-uikit-v2'
import { NormalComponents, SpecialComponents } from 'react-markdown/src/ast-to-react'
import styled from 'styled-components'

const Table = styled.table`
  margin-bottom: 32px;
  margin-top: 32px;
  width: 100%;

  td,
  th {
    color: ${({ theme }) => theme.colors.text};
    padding: 8px;
  }
`
const TableBox = styled.div`
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`

const ThemedComponent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
  margin-top: 16px;

  li {
    margin-bottom: 8px;
  }
`

const Pre = styled.pre`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
  margin-top: 16px;
  max-width: 100%;
  overflow-x: auto;
`

const AStyle = styled.a`
  word-break: break-all;
  text-decoration-line: underline;
  color: #30adff;
`

const TitleH1 = (props) => {
  return <Heading as="h1" fontSize="2em !important" my="16px" {...props} />
}
const TitleH2 = (props) => {
  return <Heading as="h2" fontSize="1.5em !important" my="16px" {...props} />
}
const TitleH3 = (props) => {
  return <Heading as="h3" fontSize="1.17em !important" my="16px" {...props} />
}
const TitleH4 = (props) => {
  return <Heading as="h4" fontSize="1em !important" my="16px" {...props} />
}
const TitleH5 = (props) => {
  return <Heading as="h5" fontSize=".87em !important" my="16px" {...props} />
}
const TitleH6 = (props) => {
  return <Heading as="h6" fontSize=".63em !important" my="16px" {...props} />
}

const Code = styled.code`
  color: #c7254e;
  background-color: #f9f2f4;
  border-radius: 4px;
  padding: 0px 4px;
`

const markdownComponents: Partial<NormalComponents & SpecialComponents> = {
  h1: TitleH1,
  h2: TitleH2,
  h3: TitleH3,
  h4: TitleH4,
  h5: TitleH5,
  h6: TitleH6,
  p: (props) => {
    return <p {...props} style={{ lineHeight: '1.3rem', fontWeight: 400 }} />
  },
  table: ({ ...props }) => {
    return (
      <TableBox>
        <Table>{props.children}</Table>
      </TableBox>
    )
  },
  ol: (props) => {
    return <ThemedComponent as="ol" {...props} />
  },
  ul: (props) => {
    return <ThemedComponent as="ul" {...props} />
  },
  pre: Pre,
  a: AStyle,
  code: Code,
}

export default markdownComponents