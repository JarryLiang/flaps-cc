import React from "react";
import showDialog from "/imports/components/suggest-level-dialog/showDialog";
import SuggestLevelsPicker from './suggest-level-picker';

import CommonDialog from "/imports/components/CommonDialog";


interface IDialogProps {
  visible: boolean;
  onCancel: () => void;
  onOK: (result: any) => void
}


function SuggestLevelsDialog(props: IDialogProps) {
  const {visible, onCancel, onOK, ...rest} = props;

  const passed = {
    onOK:onOK,
    onCancel:onCancel,
    ...rest,
  }
  function drawPicker(){

    // @ts-ignore
    return(<SuggestLevelsPicker {...passed} />);
  }
  return (
    <CommonDialog visible={visible} {...rest} padding={8} width={500}>
      {drawPicker()}
    </CommonDialog>
  );
}



interface IProps {
  // @ts-ignore
  onOK:({levels,finalLevel})=>void;
}


// eslint-disable-next-line import/prefer-default-export
export function showSuggestLevelsDialog(props: IProps) {
  const { onOK,...rest } = props;
  showDialog(SuggestLevelsDialog, { onOK,...rest });
}
