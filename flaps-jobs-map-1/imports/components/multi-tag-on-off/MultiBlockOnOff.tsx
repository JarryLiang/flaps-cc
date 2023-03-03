import {ListOP, mergeTwoList} from "/imports/utils/ListOP";
import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Tag, Checkbox} from "antd";
import {showErr} from "/imports/ui/common/antd-wrap";




const Holder = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #EEE;

  > .frame {
    display: inline-block;
    margin: 4px;
    padding: 4px;
    border: solid 1px #CCC;
    background-color: #FFF;

    &.selected {
      background-color: orange;
    }
  }
`;

interface IProps {
  items: any[];
  value?: any;
  values?: any[];
  single?: boolean;
  itemRender: (value: any) => React.ReactNode;
  onUpdate?: (value: any | any[]) => void;
  style?: any;
  nullable?: boolean;
  getKey?:any;
}

const MultiBlockCheckboxRow = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr;
  align-items: center;
`;

export function MultiBlockCheckbox(props: IProps) {
  const {
    items, value, values, single, itemRender, onUpdate,  getKey,
  } = props;

  function clearSelect() {
    // @ts-ignore
    onUpdate(null);
  }
  function setSelect(v:any) {
    // @ts-ignore
    onUpdate(v);
  }

  function removeFromList(v:any) {
    // @ts-ignore
    const r = ListOP.excludeFromList(values || [], [v]);
    // @ts-ignore
    onUpdate(r);
  }
  // @ts-ignore
  function addToList(v) {
    // @ts-ignore
    const r = mergeTwoList(values || [], [v]);
    // @ts-ignore
    onUpdate(r);
  }
  // @ts-ignore
  function renderCheckBox(item) {
    const currentMatch = getKey ? getKey(item) : item;

    if (single) {
      if (value === currentMatch) {
        return (<Checkbox checked onChange={() => { clearSelect(); }} />);
      }
      return (<Checkbox checked={false} onChange={() => { setSelect(currentMatch); }} />);
    }
    // -->
    const exist = ListOP.inList(values || [], currentMatch);
    if (exist) {
      return (<Checkbox checked onChange={() => { removeFromList(currentMatch); }} />);
    }
    return (<Checkbox checked={false} onChange={() => { addToList(currentMatch); }} />);
  }
  function renderItems() {
    const views = items.map((item) => {
      const k = getKey ? getKey(item) : JSON.stringify(item);
      return (
        <MultiBlockCheckboxRow key={k}>
          {renderCheckBox(item)}
          {itemRender(item)}
        </MultiBlockCheckboxRow>
      );
    });
    return views;
  }
  return (
    <div>
      {renderItems()}
    </div>
  );
}
export function MultiBlockOnOff(props:IProps) {
  const {
    items, value, values, single, itemRender, onUpdate, style, nullable,
  } = props;

// @ts-ignore
  function processClick(item) {
    if (single) {
      if (item === value) {
        if (nullable === false) {
          return;
        }
        // @ts-ignore
        onUpdate(null);
      } else {
        // @ts-ignore
        onUpdate(item);
      }
      return;
    }
    // @ts-ignore
    const exist = values.find((v) => {
      return v === item;
    });

    if (exist) {
      // @ts-ignore
      const newlist = ListOP.excludeFromList(values, [item]);
      // @ts-ignore
      onUpdate(newlist);
    } else {
      // @ts-ignore
      onUpdate([...values, item]);
    }
  }

  function renderItem(item: any, index: number, selected: boolean) {
    const view = itemRender(item);
    const key = `item-${index}`;
    const clz = classNames('frame', { selected });
    return (
      <div
        key={key}
        onClick={() => {
          processClick(item);
        }}
        className={clz}
      >
        {view}
      </div>
    );
  }

  function renderItems() {

    if (items) {
      const views = items.map((item, index) => {
        const pv = value ? [value] : [];
        const toCompare = single ? pv : values;
        if(!toCompare){
          showErr("Forget add single for MultiBlockOnOff ?");
        }
        // @ts-ignore
        const exist = toCompare.find((v) => {
          return v === item;
        });
        return renderItem(item, index, !!exist);
      });
      return views;
    }
    return (<Tag color="red">No Items</Tag>);
  }

  return (
    <Holder style={style}>
      {renderItems()}
    </Holder>
  );
}
