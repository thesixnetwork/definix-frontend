import React from "react";
import styled from "styled-components";
import * as Icons from ".";

export default {
  title: "Components/Icon",
  component: Icons.LogoMainFinixIcon,
  argTypes: {},
};

const StyledFlex = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid lightgray;
  min-height: 50px;
`;

export const Default: React.FC = () => {
  return (
    <>
      {Object.keys(Icons).map((icon) => {
        const Icon = Icons[icon];
        return (
          <StyledFlex>
            <div
              style={{
                width: "200px",
              }}
            >
              {icon}
            </div>
            <Icon />
          </StyledFlex>
        );
      })}
    </>
  );
};
