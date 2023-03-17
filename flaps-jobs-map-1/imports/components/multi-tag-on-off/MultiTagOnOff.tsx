import React from 'react';
import {Tag} from "antd";


import {ListOP} from "@alibobo99/js-helper";

import { TagsHolder} from "/imports/components/single-field";



interface IProps {
  items:any;
  value?:any;
  values?:any;
  onUpdate:any;
  single:any;
  toggleAll?:any;
  Component?:any;
  selectedColor?:any;
  unselectedColor?:any;
}


// TODO: add toggle all
export function MultiTagOnOff(props:IProps) {
  const {
    items, value, values, onUpdate, single, toggleAll, Component, selectedColor, unselectedColor,
  } = props;
  function removeItem(k:any) {
    if (single) {
      onUpdate(null);
    } else {
      const newValues = ListOP.excludeFromList(values, [k],null);
      onUpdate(newValues);
    }
  }
  function addItem(k:any) {
    if (single) {
      onUpdate(k);
    } else if (!ListOP.existInList(values, k,null)) {
      onUpdate([...values, k]);
    }
  }
  // @ts-ignore
  function renderItem(item, selected) {
    if (typeof (item) === 'string') {
      if (selected) {
        if (Component) {
          return (<Component value={item} key={item} color={selectedColor || '#00f'} onClick={() => { removeItem(item); }} />);
        }
        return (<Tag key={item} color={selectedColor || '#00f'} onClick={() => { removeItem(item); }}>{item}</Tag>);
      }
      if (Component) {
        return (<Component color={unselectedColor} value={item} key={item} onClick={() => { addItem(item); }} />);
      }
      return (<Tag color={unselectedColor} key={item} onClick={() => { addItem(item); }}>{item}</Tag>);
    }
    const { label, value: v } = item;

    if (selected) {
      return (<Tag key={v} color={selectedColor || '#00f'} onClick={() => { removeItem(v); }}>{label}</Tag>);
    }
    return (<Tag key={v} color={unselectedColor} onClick={() => { addItem(v); }}>{label}</Tag>);
  }
  function handleAllOn() {
    const list = items.map((item:any) => {
      if (typeof (item) === 'string') {
        return item;
      }
      return item.value;
    });
    onUpdate([...list]);
  }
  function handleAllOff() {
    if (single) {
      onUpdate(null);
    } else {
      onUpdate([]);
    }
  }
  function checkEqual(item:any, select:any) {
    if (!select) {
      return false;
    }
    if (typeof (item) === 'string') {
      return item === select;
    }
    return item.value === select;
  }
  function renderIems() {
    const views = items.map((item:any) => {
      if (single) {
        return renderItem(item, checkEqual(item, value));
      }
      const exist = values.find((v:any) => {
        return checkEqual(item, v);
      });
      return renderItem(item, exist);
    });
    if (views.length > 0) {
      if (toggleAll) {
        if (!single) {
          views.push(<Tag key="allOn" onClick={handleAllOn}>All</Tag>);
        }
        views.push(<Tag key="allOff" onClick={handleAllOff}>Clear</Tag>);
      }
    }

    return views;
  }
  if (items.length === 0) {
    return null;
  }


  return (
    <div>
      <TagsHolder style={{ display: 'inline-flex', margin: 0 }}>
        {renderIems()}

      </TagsHolder>
    </div>
  );
}

