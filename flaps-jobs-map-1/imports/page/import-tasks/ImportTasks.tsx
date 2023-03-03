import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {MenuBar} from "/imports/ui/Menubar";
import {Button} from "antd";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Meteor } from "meteor/meteor";


const Holder = styled.div`

`;

interface IProps {

}

function ImportTasks(props:IProps) {
  const { } = props;

  useEffect(()=>{

  },[]);


  function doImportJobs(){
    Meteor.call("import.jobs",(err,res)=>{});
  }
  function doImportCompanies(){
    Meteor.call("import.companies",(err,res)=>{});
  }
  function doPostProc(){
    Meteor.call("postproc.fields",(err,res)=>{});
  }
  return (
    <Holder>
      <MenuBar/>
      <AlignCenterRow>
        <Button onClick={doImportJobs}>Import Jobs</Button>
        <Button key="importCompanies" onClick={doImportCompanies}>Import Companies</Button>
        <Button key="postProc" onClick={doPostProc}>PostProc</Button>
      </AlignCenterRow>
    </Holder>
  );
}


export function ImportTasks_ForStory(props:IProps){
 return (<ImportTasks {...props} />);
}

export default ImportTasks;
