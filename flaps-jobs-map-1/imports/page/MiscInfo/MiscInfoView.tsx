import JsonPre from "/imports/ui/common/JsonPre";
import {MenuBar} from "/imports/ui/Menubar";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Meteor } from "meteor/meteor";


const Holder = styled.div`

`;

interface IProps {

}

function MiscInfoView(props:IProps) {
  const { } = props;

  const [info,setInfo ] = useState();

  function loadMiscInfo(){
    Meteor.call("info.misc",(err,res)=>{
      setInfo(res);
    })
  }
  useEffect(()=>{
    loadMiscInfo();
  },[]);



  return (
    <Holder>
      <MenuBar />
      <JsonPre data={info} />
    </Holder>
  );
}


export function MiscInfoView_ForStory(props:IProps){
 return (<MiscInfoView {...props} />);
}

export default MiscInfoView;
