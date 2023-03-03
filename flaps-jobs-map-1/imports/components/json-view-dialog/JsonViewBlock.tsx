import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
// import OmHelper from 'client/OmHelper';
import { Modal} from "antd";

import showDialog from "/imports/components/suggest-level-dialog/showDialog";

import {Button, Tag, Tooltip} from "antd";


const Holder = styled.div`
  padding: 10px;
  overflow-y: auto;
  height: 540px;
`;




function JsonViewBlock({ data, onCancel }) {
  let pre1 = null;
  if (data === undefined) {
    return (
      <Holder>
        no data
      </Holder>
    );
  }
  if (data.encode) {
    pre1 = (
      <pre>
        {/* eslint-disable-next-line no-underscore-dangle */}
        {data.__type}
      </pre>
    );
  }
  const content = (typeof (data) === 'string') ? data : (<pre>{JSON.stringify(data, null, 2)}</pre>);
  return (
    <Holder>
      {pre1}
      {content}
    </Holder>
  );
}

JsonViewBlock.propTypes = {
  data: PropTypes.any,
  onCancel: PropTypes.any,
};


function JsonViewDialog(props) {
  const {
    visible, onCancel, width, ...rest
  } = props;
  if (!visible) {
    return null;
  }

  return (
    <Modal
      title="JSON"
      visible={visible}
      closable
      width={width || 600}
      footer={null}
      bodyStyle={{ padding: 8 }}
      onCancel={onCancel}
    >
      <JsonViewBlock
        {...rest}
        onCancel={onCancel}
      />
    </Modal>
  );
}

JsonViewDialog.propTypes = {
  onCancel: PropTypes.any,
  visible: PropTypes.any,
  width: PropTypes.any,
};


export function showJsonViewDialog({ data, width }) {
  showDialog(JsonViewDialog, {
    data, width,
  });
}

const JsonButtonHolder = styled.div`
  position:absolute;
  &.right-top {
     display: inline-block;
     right: 2px;
     top: 2px; 
  }
  &.right-bottom {
     display: inline-block;
     right: 2px;
     bottom: 2px;
  }
`;

interface IJsonButtonProps {
  data:any;
  title:string;
  small?:boolean;
  position?:any;
  tip?:string;
}



export function JsonButton(props:IJsonButtonProps) {
  const {
    data, title, small, position,tip
  } =props;
  function handleClick() {
    if(typeof(data) =="function"){

      const c= data();
      showJsonViewDialog({ data:c, width: 800 });
    }else {
      showJsonViewDialog({ data, width: 800 });
    }

  }
  const view = small ? (<Tag onClick={handleClick}>{title || 'JSON'}</Tag>) : (<Button onClick={handleClick}>{title || 'JSON'}</Button>);

  function renderButton() {
    return (
      <Tooltip title={tip||"Show JSON"}>
        {view}
      </Tooltip>
    );
  }

  if (position) {
    return (
      <JsonButtonHolder className={position}>
        {renderButton()}
      </JsonButtonHolder>
    );
  }
  return renderButton();
}
