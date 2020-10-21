import React, { useContext, useState } from "react";
import Icon from "@mdi/react";
import { mdiViewSplitHorizontal, mdiViewSplitVertical } from "@mdi/js";
import * as Config from "../services/config";
import { GithubClientContext, LayoutStoreContext } from "../contexts";
import { CreateGithubClient } from "../services/github";
import styled from "styled-components";
import type { Layout } from "../services/config";

function LayoutRadioItem({
  value,
  current,
  setter,
  children,
}: {
  value: Layout;
  current: Layout;
  setter: (v: Layout) => void;
  children: (JSX.Element | string)[];
}) {
  return (
    <RadioItem>
      <RadioInput
        type="radio"
        name="layout"
        id={`radio_layout_${value}`}
        value={value}
        checked={current == value}
        onChange={() => setter(value)}
      ></RadioInput>
      <RadioLabel htmlFor={`radio_layout_${value}`}>{children}</RadioLabel>
    </RadioItem>
  );
}

const RadioItem = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 4px;
`;
const RadioLabel = styled.label`
  width: 100px; /* adjust clickable area */
  font-size: 1.4rem;

  & svg {
    display: block;
    margin: -8px -4px; /* adjust for icon itself's margin */
  }
`;
const RadioInput = styled.input`
  margin-right: 12px;
`;

export default function Setting() {
  const config = Config.value();
  const [layout, setLayout] = useState(config.layout);
  const [apiBase, setApiBase] = useState(config.github.apiBase);
  const [apiToken, setApiToken] = useState(config.github.apiToken);

  const ghcContext = useContext(GithubClientContext);
  const layoutContext = useContext(LayoutStoreContext);

  const saveLayout = (value: Layout) => {
    setLayout(value);
    Config.setLayout(value);
  };

  const [isDirty, setIsDirty] = useState(false);
  function d<T>(f: React.Dispatch<React.SetStateAction<T>>) {
    return ((v: T) => {
      f(v);
      setIsDirty(true);
    }) as React.Dispatch<React.SetStateAction<T>>;
  }
  const saveGithub = () => {
    Config.setGithub({
      apiBase,
      apiToken,
    });
    layoutContext.set(layout);
    ghcContext.set(CreateGithubClient(apiBase, apiToken));
    setIsDirty(false);
  };

  return (
    <Root>
      <Section>
        <SectionTitle>Appearance</SectionTitle>

        <Field>
          <Label>Layout</Label>
          <LayoutRadioItem value="H" current={layout} setter={saveLayout}>
            Horizontal
            <Icon path={mdiViewSplitHorizontal} size="60px" color="gray" />
          </LayoutRadioItem>
          <LayoutRadioItem value="V" current={layout} setter={saveLayout}>
            Vertical
            <Icon path={mdiViewSplitVertical} size="60px" color="gray" />
          </LayoutRadioItem>
        </Field>
      </Section>

      <Section>
        <SectionTitle>GitHub API</SectionTitle>

        <Field>
          <Label>API Endpoint</Label>
          <Input
            type="text"
            value={apiBase}
            onChange={(e) => d(setApiBase)(e.target.value)}
            placeholder="https://api.github.com or https://your.ghe.com/api"
          ></Input>
        </Field>

        <Field>
          <Label>API Token</Label>
          <Input
            type="text"
            value={apiToken}
            onChange={(e) => d(setApiToken)(e.target.value)}
            placeholder="12345abcde12345abcde12345abcde12345abcde"
          ></Input>
        </Field>

        <Field>
          <SaveButton
            isActive={isDirty}
            disabled={!isDirty}
            onClick={saveGithub}
          >
            Set
          </SaveButton>
        </Field>
      </Section>
    </Root>
  );
}

const Root = styled.article`
  width: 1000px;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h1`
  font-weight: normal;
  border-bottom: solid 1px lightgray;
  margin-bottom: 16px;
`;

const Field = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.h2`
  font-size: 1.4rem;
`;

const Input = styled.input`
  border: solid 1px lightgray;
  padding: 4px 8px;
  font-size: 1.4rem;
  width: 400px;
`;

const SaveButton = styled.button<{ isActive: boolean }>`
  color: whitesmoke;
  background-color: ${({ isActive }) => (isActive ? "mediumseagreen" : "gray")};
  padding: 4px 12px;
  border-radius: 4px;
`;
