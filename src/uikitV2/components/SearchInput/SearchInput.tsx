import React, { cloneElement, ElementType, isValidElement, useState, useRef } from "react";
import { textStyle } from "../../text";
import styled, { css } from "styled-components";
import { SearchInputProps } from "./types";
import { Flex } from "../Box";
import { layout } from "styled-system";
import { SearchIcon, ResetIcon } from "../Icon";
import { IconButton } from "../Button";

const StyledInput = styled.input`
  border: 0;
  display: block;
  height: 100%;
  ${css(textStyle.R_14R)}
  color: #000000;
  outline: 0;
  padding: 10px 16px;
  width: 100%;
  background-color: transparent;

  &::placeholder {
    ${css(textStyle.R_14R)}
    color: #999999;
  }

  &:disabled {
    box-shadow: none;
    cursor: not-allowed;
  }

  /* &:focus:not(:disabled) {
    box-shadow: 0px 0px 0px 1px #0973B9, 0px 0px 0px 4px rgba(9, 115, 185, 0.2);
  } */
`;

const StyledFlex = styled(Flex)`
  position: relative;
  width: 100%;
  height: 40px;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding-right: 16px;
  ${layout}
`;

const SearchInput = <E extends ElementType = "input">(props: SearchInputProps): JSX.Element => {
  const input = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState("");
  const { onSearch, onReset, ...rest } = props;
  return (
    <StyledFlex>
      <StyledInput
        ref={input}
        {...rest}
        defaultValue={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.code.toLowerCase() === "enter") onSearch(keyword);
        }}
      />

      {keyword.length > 0 && (
        <IconButton
          mr={12}
          p={0}
          onClick={() => {
            setKeyword("");
            if (input.current && input.current !== null) {
              input.current.value = "";
            }
            onReset();
          }}
        >
          <ResetIcon />
        </IconButton>
      )}
      <IconButton p={0} onClick={() => onSearch(keyword)}>
        <SearchIcon />
      </IconButton>
    </StyledFlex>
  );
};

export default SearchInput;
