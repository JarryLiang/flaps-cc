import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {showErr} from "/imports/ui/common/antd-wrap";
import {StringInputHook} from "/imports/ui/input/inputs";
import {MenuBar} from "/imports/ui/Menubar";
import {PromiseHelper} from "/imports/utils/PromiseHelper";
import {StringHelper} from "@alibobo99/js-helper";
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {Button, TreeSelect} from 'antd';

const {SHOW_CHILD,SHOW_PARENT} = TreeSelect;
import AreaRaw from "./area.json";
import JobRaw  from "./jobcat.json";

const Holder = styled.div`
  .content{
    padding: 10px;
    .tree-holders {
      display: grid;
      grid-template-columns: 400px 400px 1fr;
      grid-gap: 20px;
    }
  }
`;

interface IProps {

}

function convertAreaItem(item: any) {
  const {no, des, n} = item;
  if (n) {
    const children = n.map((c) => {
      return convertAreaItem(c);
    });
    return {
      title: des,
      value: no,
      key: no,
      children
    }
  } else {
    return {
      title: des,
      value: no,
      key: no,
    }
  }
}

function convertRawData(json) {
  const result = json.map((item) => {
    return convertAreaItem(item);
  })
  return result;
}

const areaData = convertRawData(AreaRaw[0].n);
const jobCatData = convertRawData(JobRaw);

const defaultQuery = {
  "ro": "0",
  "isnew": "30",
  "kwop": "7",
  "expansionType": "area,spec,com,job,wf,wktm",
  "area": "6001001001",
  "order": "16",
  "asc": "0",
  "page": "1",
  "mode": "s",
  "jobsource": "2018indexpoc",
  "langFlag": "0",
  "langStatus": "0",
  "recommendJob": "1",
  "hotJob": "1"
}
const ROOTURL = "https://www.104.com.tw/jobs/search/";



function OpenPageHelper(props: IProps) {
  const {} = props;

  const [areas,setAreas ] = useState([]);
  const [jobCats,setJobCats ] = useState<string[]>([]);

  const [keyword,setKeyword ] = useState("");
  useEffect(() => {

  }, []);




  function buildQuery(userQuery){
    //store query parameters in a temporary variable
    var query = [];
    //loop through user query object
    for (var key in userQuery) {
      //encode the keys and values this is most necessary for search inputs
      query.push(encodeURIComponent(key) + '=' + encodeURIComponent(userQuery[key]));
    }
    //construct new URL
    let new_url = ROOTURL+ (query.length ? '?' + query.join('&') : '');
    return(new_url);
  }

  function asyncOpenURL(custParam:any) {
    const query = {
      ...defaultQuery,
      ...custParam
    }

    const url = buildQuery(query);

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(url);
        window.open(url,"_blank");
        resolve(custParam);
      }, 1000);

    });

  }

  async function asyncBatchOpen() {

    let jobCat = undefined;
    if(jobCats.length>0){
        jobCat = jobCats.join(",");
    }

    const _areas = [...areas];
    setAreas([]);
    for await (const area of _areas) {
      const param = {
        area,
      }
      if(StringHelper.isBlank(keyword)==false){
        // @ts-ignore
        param["keyword"]=keyword;
      }
      if(jobCat){
        // @ts-ignore
        param["jobcat"] = jobCat;
      }
      await asyncOpenURL(param);
    }
  }

  function checkOptions() {
    if(areas.length==0){
      showErr("Invalid area");
      return false;
    }
    if(StringHelper.isBlank(keyword)){
      if(jobCats.length==0){
        showErr("Input keyword or select job");
        return false;
      }
    }
    return true;
  }

  function handleBatchOpen() {
    if(checkOptions()){
      PromiseHelper.simpleProcess(asyncBatchOpen());
    }
  }

  function renderAction() {
    if (areas.length > 0) {
      return (
          <Button onClick={handleBatchOpen}>Open Pages</Button>
      );
    }
    return (
        <Button disabled>Open Pages</Button>

    );
  }

  const treeAreaProps= {
    treeData:areaData,
    value: areas,
    onChange: setAreas,
    treeCheckable: true,
    showCheckedStrategy: SHOW_CHILD,
    placeholder: 'Please select',
    style: {
      width: '100%',
    },
  };

  const treeJobCatProps= {
    treeData: jobCatData,
    value: jobCats,
    onChange: setJobCats,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: 'Please select',
    style: {
      width: '100%',
    },
  };


  return (
    <Holder>
      <MenuBar/>
      <div className={"content"}>
      <h2>Select Area to Open</h2>
      <AlignCenterRow>
        <span>Keyword:</span>
        <StringInputHook value={keyword} onUpdate={setKeyword} />
        <span/>
        {renderAction()}
      </AlignCenterRow>
      <br/>
        <div className={"tree-holders"}>
          <div>
            <div>地區</div>
            <TreeSelect {...treeAreaProps} />
          </div>
          <div>
            <div>職務</div>
            <TreeSelect {...treeJobCatProps} />
          </div>
        </div>

      </div>
    </Holder>
  )
}


export default OpenPageHelper;
