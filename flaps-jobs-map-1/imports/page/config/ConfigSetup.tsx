import {RowHolder} from "/imports/components/single-field";
import {HeaderBar} from "/imports/components/styled";
import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {showMsg} from "/imports/ui/common/antd-wrap";
import {StringInputHook} from "/imports/ui/input/inputs";
import {MenuBar} from "/imports/ui/Menubar";
import {Button} from "antd";
import {Meteor} from 'meteor/meteor';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';


const Holder = styled.div`
  padding: 10px;
`;

interface IProps {

}

function ConfigSetup(props: IProps) {
  const {} = props;
  const [oriStatus, setOriStatus] = useState({});

  const [jsonImportPath, setJsonImportPath] = useState("");
  const [tempPath,setTempPath ] = useState("");



  function loadState() {
    Meteor.call("config.load", (err, res) => {
      try {
        if (res) {
          const ori = JSON.parse(res) || {};
          setJsonImportPath(ori.jsonImportPath || "");
          setTempPath(ori.tempPath||"");
          setOriStatus(ori);
        }
      } catch (e) {

      }
    });
  }

  useEffect(() => {
    loadState();
  }, []);


  function saveConfig() {
    const data = {
      ...oriStatus,
      jsonImportPath:jsonImportPath.trim(),
      tempPath:tempPath.trim()
    }
    const raw = JSON.stringify(data, null, 2);
    // @ts-ignore
    Meteor.call("config.save", raw, () => {
      showMsg("Operation complete");
    });
  }

  function doClearCache(){
    Meteor.call("misc.clearCache",(err,res)=>{
      showMsg("Operation completed");
    });
  }
  return (
    <Holder>
      <MenuBar/>
      <HeaderBar title={"Configuration"}>
        <Button type="primary" onClick={saveConfig}>Save</Button>
      </HeaderBar>
      <RowHolder title={"Import Path"}>
        <StringInputHook value={jsonImportPath} onUpdate={setJsonImportPath}/>
      </RowHolder>
      <RowHolder title="Management" wrap>
        <AlignCenterRow>
          <Button type={"primary"} onClick={doClearCache}>Clear Caches</Button>
        </AlignCenterRow>
      </RowHolder>

    </Holder>
  );
}


export function ConfigSetup_ForStory(props: IProps) {
  return (<ConfigSetup {...props} />);
}

export default ConfigSetup;
