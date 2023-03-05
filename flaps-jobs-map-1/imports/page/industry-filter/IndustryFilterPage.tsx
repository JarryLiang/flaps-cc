import {JobClientUtils} from "/imports/job-nav/JobClientUtils";
import JsonPre from "/imports/ui/common/JsonPre";
import {SwitchInputHook} from "/imports/ui/input/inputs";
import {MenuBar} from "/imports/ui/Menubar";
import {MeteorCommon} from "/imports/utils/MeteorCommon";
import {PromiseHelper} from "/imports/utils/PromiseHelper";
import {Table} from "antd";
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import CompanyOfIndustryView from "./CompanyOfIndustryView";


const Holder = styled.div`

`;

interface IProps {

}

function IndustryFilterPage(props: IProps) {
  const {} = props;

  const [industries, setIndustries] = useState([]);
  const [industryIgnoreMap, setIndustryIgnoreMap] = useState({});

  async function loadIndustries() {

    const r1 = await MeteorCommon.simpleCall("jobs.getIndustryStatistic") as string;
    // @ts-ignore
    setIndustries(JSON.parse(r1));
    const r2 = await MeteorCommon.simpleCall("jobs.getIndustryIgnoreMap") as string;
    setIndustryIgnoreMap(JSON.parse(r2));

  }

  useEffect(() => {
    PromiseHelper.simpleProcess(loadIndustries());

  }, []);

  function expandedRowRender( record ) {
    return (<CompanyOfIndustryView coIndustryDesc={record.coIndustryDesc} />);
  }


  function updateIndustryIgnore(coIndustryDesc: any, newValue: boolean) {

    const m = {
      ...industryIgnoreMap,
      [coIndustryDesc]:newValue
    }
    const toUpdate ={
      [coIndustryDesc]:newValue
    }
    setIndustryIgnoreMap(m);
    //==>
    PromiseHelper.simpleProcess(MeteorCommon.simpleCall("jobs.setIndustryIgnore",toUpdate));

  }

  function renderIgnoreIndustry(record){
    const {coIndustryDesc} = record;
    // @ts-ignore
    const v:boolean = industryIgnoreMap[coIndustryDesc] as boolean;
    return (<SwitchInputHook checked={v} onChange={(newValue)=>{
      updateIndustryIgnore(coIndustryDesc,newValue);
    }} />)

  }
  function renderIndustryTable() {

    // {
    //   "coIndustryDesc": "電子通訊／電腦週邊零售業",
    //   "company": 111,
    //   "jobs": 949
    // },

    const columns = [
      {
        title: 'Name',
        dataIndex: 'coIndustryDesc',
        key: 'coIndustryDesc',
        width: 200,
      },
      {
        title: 'company',
        dataIndex: 'company',
        key: 'company',
        width: 50,
        align:'right',
        sorter:(a,b)=>{
          return a.company-b.company;
        }
      },
      {
        title: 'jobs',
        dataIndex: 'jobs',
        key: 'jobs',
        width: 50,
        align:'right',
        sorter:(a,b)=>{
          return a.jobs-b.jobs;
        }
      },
      {
        title: 'Ignore',
        key: 'Ignore',
        width: 100,
        render:renderIgnoreIndustry
      },
      {
        title: '',
        key: 'Empty',
      },
    ];
    return (
      <Table
        bordered
        size={"small"}
        pagination={{pageSize:30}}
        dataSource={industries}
        columns={columns}
        expandedRowRender={expandedRowRender}
        rowKey={(r) => {
          return r.coIndustryDesc;
        }}
      />
    );
  }


  return (
    <Holder>
      <MenuBar/>
      {renderIndustryTable()}
    </Holder>
  );
}


export function IndustryFilterPage_ForStory(props: IProps) {
  return (<IndustryFilterPage {...props} />);
}

export default IndustryFilterPage;
