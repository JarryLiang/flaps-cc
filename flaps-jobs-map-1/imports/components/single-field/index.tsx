import {Tag} from "antd";
import styled from 'styled-components';
import React from 'react';


const TagsHolderWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 4px 4px 4px 0px;
  padding: 4px;
  border: solid 1px #ccc;
  >span {
    margin: 2px;
  }
`;

function isNullOrUndefined(t:any) {
  if (t === null) {
    return true;
  }
  if (t === undefined) {
    return true;
  }
  return false;
}


// @ts-ignore
export function TagsHolder(props) {
  const { style, children, noborder, margin,} = props;

  let style1 = style ? { ...style } : {};
  if (noborder) {
    style1 = {
      ...style1,
      border: 'none',
    };
  }

  if (!isNullOrUndefined(margin)) {
    style1 = {
      ...style1,
      margin,
    };
  }
  return (
    <TagsHolderWrap style={style1}>
      {children}
    </TagsHolderWrap>
  );
}

const RowViewHolder = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  grid-gap: 5px;
  align-items: center;
  padding-left: 10px;
  margin-top: 5px;
  >.title {
    word-break: break-word;
  }
  &.under {
    padding-bottom: 4px;
    border-bottom: solid 1px #ccc;
  }

`;

interface IRowHolderProps {
  title?:string;
  children:any;
  style?:any;
  left?:number;
  border?:boolean;
  subTitle?:any;
  wrap?:boolean;
  addClass?:any;
  bar?:boolean;
}


export function RowHolder(props:IRowHolderProps) {
  const {
    title, children, style, left, border, subTitle, wrap, addClass,bar
  }=props;
  const st = style ? { ...style } : {};
  if (left) {
    st.gridTemplateColumns = `${left}px 1fr`;
  }
  if(bar){
    st["borderTop"]="solid 1px #CCC";
    st["paddingTop"]=4;
  }
  const toChildren = wrap ? (<div>{children}</div>) : children;

  if (border) {
    return (
      <RowViewHolder style={st} className={addClass || ''}>
        <div className="title">
          <div>{title}</div>
          <div style={{
            color: 'gray',
            fontSize: 10,
            fontWeight: 'bold',
          }}
          >
            {subTitle}
          </div>
        </div>
        <div style={{
          border: '#ccc 1px solid',
          padding: '4px 4px 4px 0px',
        }}
        >
          {toChildren}
        </div>
      </RowViewHolder>
    );
  }
  return (
    <RowViewHolder style={st} className={addClass || ''}>
      <div className="title">
        <div>{title}</div>
        <div style={{
          color: 'gray',
          fontSize: 10,
          fontWeight: 'bold',
        }}
        >
          {subTitle}
        </div>
      </div>
      {toChildren}
    </RowViewHolder>
  );
}

const SectionTitleHolderWrapper = styled.div`
  position: relative;
  margin: 16px 4px 4px 4px;
  padding: 10px;
  border: solid 1px #ccc;
  >.title {
    position: absolute;
    left: 10px;
    top: -10px;
    padding-left: 10px;
    padding-right: 10px;
    line-height: 16px;
    font-size: 14px;
    font-weight: bold;
    background-color: #fff;
    color: #0000cc;
  }
  >.inner {

  }
`;

// @ts-ignore
export function SectionTitleHolder(props) {
  const {
    title, children, onDel, style,
  } = props;

  const delView = onDel ? (<Tag color="red" onClick={onDel}>X</Tag>) : null;
  return (
    <SectionTitleHolderWrapper style={style}>
      <div className="title">
        {title}
        {' '}
        {delView}
      </div>
      <div className="inner">
        {children}
      </div>
    </SectionTitleHolderWrapper>
  );
}


