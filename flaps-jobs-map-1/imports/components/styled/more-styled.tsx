import React, {useState, useEffect} from 'react';
import {ButtonWithState} from "components/wrap/button";
import styled from 'styled-components';


import {Button} from "antd";

const Holder = styled.div`

`;


interface IButtonAction {
  title: string;
  action: () => void;
  hasEnable?: boolean;
  enabled?: boolean;
  type?: string;
}

interface IProps {
  title: string;
  actions: IButtonAction[];
  children: React.ReactNode;
  titleStyle: any;
}


const HeaderBarWithActionsHolder = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;

  > .actions {
    display: grid;
    grid-template-columns: auto auto auto auto auto;
    grid-gap: 10px;
  }

`;

function HeaderBarWithActions(props: IProps) {
  const {title, actions, children, titleStyle} = props;
  const actionViews = (actions || []).map((ia) => {
    const {title, action, hasEnable, enabled, type} = ia;
    if (hasEnable) {
      return (<ButtonWithState key={title} enable={enabled} title={title} onClick={action}/>);
    } else {
      return (<Button key={title} type={type} onClick={action}>{title}</Button>);
    }
    return actionViews;

  });
  return (
    <HeaderBarWithActionsHolder>
      <h2 style={titleStyle}>{title}</h2>
      <div>
        {children}
      </div>
      <div className="actions">
        {actionViews}
      </div>
    </HeaderBarWithActionsHolder>
  );
}


export default HeaderBarWithActions;
