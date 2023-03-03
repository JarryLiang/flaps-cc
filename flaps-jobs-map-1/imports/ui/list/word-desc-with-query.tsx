import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {StringInputHook} from "/imports/ui/input/inputs";
import {Button} from "antd";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';

import { Meteor } from "meteor/meteor";



interface IProps {
  voc:string;
  desc:string;
  onUpdateDesc:(voc:string,desc:string)=>void;
}

function WordDescWithQueryBlock(props:IProps) {
  const { voc,desc,onUpdateDesc } = props;
  const [newDesc,setNewDesc ] = useState(desc);
  const [queryResult,setQueryResult ] = useState();
  function handlePressUpdate(){
    onUpdateDesc(voc,newDesc);
  }
  function handlePressQuery(){
    Meteor.call("util.queryDictionary",voc,(err,res)=>{
      const {translate} = res;
      if(translate){
        setNewDesc(translate);
      }
      setQueryResult(res);
    });
  }
  function renderQueryResult(){
    if(queryResult){
      return (<pre>
        {JSON.stringify(queryResult,null,2)}
      </pre>)
    }
    return null;
  }
  return (
    <div>
      <AlignCenterRow>
        <StringInputHook style={{width:300}} value={newDesc}
                         onUpdate={setNewDesc}/>
        <Button type={"primary"} onClick={handlePressUpdate}>update</Button>
        <Button type={"primary"} onClick={handlePressQuery}>Query</Button>
      </AlignCenterRow>
      {renderQueryResult()}
    </div>
  );
}


export default WordDescWithQueryBlock;
