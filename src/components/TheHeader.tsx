import React from "react";
import { Link } from "react-router-dom";
import { mdiCog } from "@mdi/js";
import Icon from "@mdi/react";
import styled from "styled-components";

export default function TheHeader() {
  return (
    <Root>
      <Title to="/">hubook</Title>
      <Spacer />
      <Preferences to="/preferences">
        <Icon path={mdiCog} color="dimgray" />
      </Preferences>
    </Root>
  );
}

export const headerHeight = "50px";

const Root = styled.header`
  display: flex;
  height: ${headerHeight};
  padding: 0 24px;
  border-bottom: solid 1px lightgray;
  align-items: center;
`;

const Title = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const PreferencesButtonSize = "36px";
const Preferences = styled(Link)`
  position: relative;
  width: ${PreferencesButtonSize};
  height: ${PreferencesButtonSize};

  & svg {
    position: relative;
    top: calc((${PreferencesButtonSize} - 24px) / 2);
    left: calc((${PreferencesButtonSize} - 24px) / 2);
    width: 24px;
    height: 24px;
  }

  &::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: lightgray;
    border-radius: 50%;

    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover {
    &::before {
      opacity: 1;
    }
  }
`;
