import {SpinText} from "/imports/components/SpinText/SpinText";
import {saveStringToFile} from "/imports/helper/IO";
import JobNav from "/imports/job-nav";
import IndustryFilterBlock from "/imports/page/jobs-map/IndustryFilterBlock";
import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {SwitchInputHook} from "/imports/ui/input/inputs";
import {MenuBar} from "/imports/ui/Menubar";
import {FoamUtils, ISegDefProps} from "/imports/utils/FoamUtils";
import {TJobAndCust} from "/server/data-104/datatype";
import {Button} from "antd";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';

import preload from "./preload.json";

import { Meteor } from "meteor/meteor";

import "../../carrotsearch_foamtree";

const Holder = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  >.content {
    flex:1;
  }
  
`;



interface IProps {

}

const empSegs:ISegDefProps[] =[
  {
    range:{
      max:6,
    },
    label:"<6人"
  },
  {
    range:{
      min:6,
      max:11,
    },
    label:"6~10"
  },
  {
    range:{
      min:11,
      max:21,
    },
    label:"10~20"
  },
  {
    range:{
      min:21,
      max:41,
    },
    label:"21~40"
  },
  {
    range:{
      min:41,
      max:51,
    },
    label:"41~50"
  },
  {
    range:{
      min:41,
      max:51,
    },
    label:"41~50"
  },
  {
    range:{
      min:51,
      max:61,
    },
    label:"51~60"
  },
  {
    range:{
      min:61,
      max:81,
    },
    label:"61~80"
  },
  {
    range:{
      min:81,
      max:101,
    },
    label:"81~100"
  },
  {
    range:{
      min:101,
      max:201,
    },
    label:"101~200"
  },
  {
    range:{
      min:201,
      max:301,
    },
    label:"201~300"
  },
  {
    range:{
      min:301,
      max:401,
    },
    label:"301~400"
  },
  {
    range:{
      min:401,
      max:501,
    },
    label:"401~500"
  },
  {
    range:{
      min:501,
      max:601,
    },
    label:"501~600"
  },
  {
    range:{
      min:601,
      max:801,
    },
    label:"601~800"
  },
  {
    range:{
      min:801,
      max:1001,
    },
    label:"801~1000"
  },
  {
    range:{
      min:1001,
      max:5001,
    },
    label:"1001~5000"
  },
  {
    range:{
      min:5001,
    },
    label:">5000"
  }

];

const capSegs:ISegDefProps[] =[
  {
    range:{
      max:100,
    },
    label:"<100萬"
  },
  {
    range:{
      min:101,
      max:301,
    },
    label:"100~300萬"
  },
  {
    range:{
      min:301,
      max:501,
    },
    label:"300~500萬"
  },
  {
    range:{
      min:501,
      max:1001,
    },
    label:"500~1000萬"
  },
  {
    range:{
      min:1001,
      max:5001,
    },
    label:"1000~5000萬"
  },
  {
    range:{
      min:5001,
      max:10001,
    },
    label:"5000萬~1億"
  },
  {
    range:{
      min:10001,
    },
    label:">1億"
  }
];

function processSegmentLabel(jobs:any[]):TJobAndCust[]{
  jobs.forEach((j)=>{
    j.empSeg=FoamUtils.converValueToSeg(j.empNoN,empSegs,"暫不提供");
    j.capSeg=FoamUtils.converValueToSeg(j.capitalN,empSegs,"未取得");
    j.jon =1;
    console.log(j.capSeg);
  });
  return jobs;

}

function JobsMapView(props:IProps) {
  const { } = props;

  const [records,setRecords ] = useState<TJobAndCust[]>();
  const [industryFilter,setIndustryFilter ] = useState<string[]>([]);
  const [showFilter,setShowFilter ] = useState(false);
  const [loading,setLoading ] = useState(false);
  const [ignoreMap,setIgnoreMap ] = useState({});

  // function preparePreload(){
  //   const result =processSegmentLabel(preload);
  //   setRecords(result);
  // }
  //
  // useEffect(()=>{
  //   preparePreload();
  // },[]);

  function doLoadJobs(){
    // @ts-ignore
    setShowFilter(false);
    setLoading(true);
    const opts = {
      industryFilter,
      skipIgnore:true
    }
    Meteor.call("jobs.list",opts,true,(err,res)=>{
      // const t=JSON.stringify(JSON.parse(res),null,2);
      // saveStringToFile(t,"jobs.json");

      // @ts-ignore
      const data=processSegmentLabel(JSON.parse(res));
      setRecords(data);
      setLoading(false);
    });
  }
  function renderNav(){
    if(records){
       return(<JobNav records={records} />);
    }
    return null;
  }
  function renderCount(){
    if(records){
      return(<div>{records.length}</div>);
    }
  }
  function renderFilter(){
    if(showFilter){
      return (  <IndustryFilterBlock onUpdate={setIndustryFilter} />);
    }
  }
  function renderFilterText(){
      if(industryFilter.length==0){
        return "未使用產業過濾"
      }
    return `已選擇 ${industryFilter.length} 各產業`;
  }
  return (
    <Holder>
      <MenuBar/>
      <AlignCenterRow>
        <Button key="loadJobs" onClick={doLoadJobs}>LoadJobs</Button>
        <div>{renderCount()}</div>
        <div></div>
        <SwitchInputHook checked={showFilter} onChange={setShowFilter} />
        <span>顯示產業過濾</span>
        <span>{renderFilterText()}</span>
        {loading && (<SpinText title={loading} />)}
      </AlignCenterRow>
      {renderFilter()}
      <div className={"content"}>
        {renderNav()}
      </div>
    </Holder>
  );
}


export function JobsMapView_ForStory(props:IProps){
 return (<JobsMapView {...props} />);
}

export default JobsMapView;
