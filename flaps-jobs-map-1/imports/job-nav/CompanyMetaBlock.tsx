import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';


import { Meteor } from 'meteor/meteor';

import {Button, Rate} from 'antd';


const Holder = styled.div`

`;

interface IProps {
  custNo:string
}

function CompanyMetaBlock(props:IProps) {
  const { custNo } = props;
  const [meta,setMeta ] = useState(null);
  const [rate,setRate ] = useState(null);

  function saveMetaBack(){
    // @ts-ignore

    const newMeta = {...meta};
    if(rate!=null){
      newMeta.rate = rate;
    }

    if(JSON.stringify(newMeta) !== JSON.stringify(meta)){
      Meteor.call("company.setMeta",custNo,newMeta,(err,res)=>{});
    };
  }

  function doSubmit(){

    saveMetaBack();
  }


  useEffect(()=>{
    if(meta){

      setRate(meta.rate ||0);
    }
  },[meta]);
  function loadData(){
    Meteor.call("company.getMeta",custNo,(err,res)=>{

      setMeta(JSON.parse(res));
    });
  }

  useEffect(()=>{
    loadData();
  },[]);



  return (
    <Holder>
      <AlignCenterRow>
        <span>Rate</span>
        <Rate value={rate} onChange={setRate} />
        <Button onClick={doSubmit} size={"small"}>提交</Button>
      </AlignCenterRow>

    </Holder>
  );
}


export function CompanyMetaBlock_ForStory(props:IProps){
 return (<CompanyMetaBlock {...props} />);
}

export default CompanyMetaBlock;
