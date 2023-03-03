import React from 'react';

import styled from 'styled-components';


export const BarHolder = styled.div`
  display: grid;
  grid-gap: 10px;
  align-items: center;
`;

export const IconHolder = styled.div`
      display: inline-block;
      width: 64px;
      height: 64px;
      overflow: hidden;
      > img {
       width: 100%;
       height: auto;
      }
`;


const HeaderBarHolder = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  >.buttons {
    display: grid;
    &.btn1 {
      grid-template-columns: auto;
    }
    &.btn2 {
      grid-template-columns: auto auto;  
    }
    &.btn3 {
      grid-template-columns: auto auto auto;
    }
    &.btn4 {
      grid-template-columns: auto auto auto auto;
    }
    
    &.btn5 {
      grid-template-columns: auto auto auto auto auto;
    }
    
    grid-gap: 10px;    
  }

`;

// export function HeaderBarWithAction({
//   title, children, style, titleStyle, onSave, onCancel,
// }) {
//
//
// }

interface IHeaderBarProps {
  title:string;
  children?:any;
  style?:any;
  titleStyle?:any;
}


export function HeaderBar(props:IHeaderBarProps) {
  const { title, children, style, titleStyle, } = props;
  function getChildrenClz() {
    if (children) {
      switch (children.length) {
        case 1:
          return 'btn1';
        case 2:
          return 'btn2';
        case 3:
          return 'btn3';
        case 4:
          return 'btn4';
        case 5:
          return 'btn5';
        default:
          return '';
      }
    }
  }
  const clz = `buttons ${getChildrenClz()}`;

  return (
    <HeaderBarHolder style={style}>
      <h3 style={titleStyle}>{title}</h3>
      <div />
      <div className={clz}>
        {children}
      </div>
    </HeaderBarHolder>
  );
}


const ErrorBlockHolder = styled.div`
  margin: 4px;
  padding: 4px;
  border: solid 1px #ff0000;  
`;

export function renderError(error) {
  if (error) {
    return (<ErrorBlock error={error} />);
  }
  return null;
}
export function ErrorBlock({ error }) {
  if (error) {
    const e = typeof error ==="string"? error: JSON.stringify(error, null, 2);
    return (
      <ErrorBlockHolder>
        <pre>
          {e}
        </pre>
      </ErrorBlockHolder>
    );
  }
  return null;
}

