import React from 'react';
import styled from 'styled-components';
import { Button} from "antd";


const Holder = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto;
    button {
      margin: 4px;
    }
`;

const HolderLeft = styled.div`
    display: grid;
    grid-template-columns: auto auto 1fr;
    align-items: center;
    button {
      margin: 4px;
    }
`;


export function CommonDialogActions({
  okValid, onCancel, onOK, cancelText, okText, alignLeft, title,
}) {
  if (alignLeft) {
    return (
      <HolderLeft>
        <Button onClick={onCancel}>{cancelText || 'Cancel'}</Button>
        {okValid ? (<Button type="primary" onClick={onOK}>{okText || 'OK'}</Button>)
          : <Button disabled>{okText || 'OK'}</Button>}
        <div>
          <h3>{title}</h3>
        </div>
      </HolderLeft>
    );
  }
  let okButton = okValid ? (<Button type="primary" onClick={onOK}>{okText || 'OK'}</Button>)
    : (<Button disabled>{okText || 'OK'}</Button>);
  okButton = onOK ? okButton : null;
  return (
    <Holder>
      <div>
        <h3>{title}</h3>
      </div>
      <Button onClick={onCancel}>{cancelText || 'Cancel'}</Button>
      {okButton}
    </Holder>
  );
}



