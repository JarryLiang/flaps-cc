
import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {showErr, showMsg} from "/imports/ui/common/antd-wrap";
import {StringInputHook} from "/imports/ui/input/inputs";
import {MenuBar} from "/imports/ui/Menubar";
import {StringHelper} from "@alibobo99/js-helper";
import {Button} from "antd";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Meteor } from "meteor/meteor";


const Holder = styled.div`

`;

interface IProps {

}

function CompanyFilterManagement(props:IProps) {
  const { } = props;

  const [word,setWord ] = useState("");
  const [keywords,setKeywords ] = useState([]);

  function loadData(){
    Meteor.call("ignore.loadKeyword",word,(err:any,res:any)=>{
      if(err){
        showErr(err);
      }else {
        setKeywords(res);
      }
    })
  }

  useEffect(()=>{
    loadData();

  },[]);


  function handlePressAdd(){
      if(StringHelper.isBlank(word)){
        return;
      }
      Meteor.call("ignore.addKeyword",word,(err:any)=>{
        if(err){
          showErr(err);
        }else {
          showMsg("Operation completed");
          setWord("");
          loadData();
        }
      })
  }
  return (
    <Holder>
      <MenuBar />
      <h2>預設過濾關鍵字</h2>
      <hr/>
      <AlignCenterRow>
        <span>關鍵字</span>
        <StringInputHook value={word} onUpdate={setWord} />
        <Button onClick={handlePressAdd}>Add</Button>
      </AlignCenterRow>
      <pre>
        {JSON.stringify(keywords,null,2)}
      </pre>
    </Holder>
  );
}


export function CompanyFilterManagement_ForStory(props:IProps){
 return (<CompanyFilterManagement {...props} />);
}

export default CompanyFilterManagement;
