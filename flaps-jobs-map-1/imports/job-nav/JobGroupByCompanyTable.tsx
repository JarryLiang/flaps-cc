import CompanyJobsExtend from "/imports/job-nav/CompanyJobsExtend";
import IgnoreCustBlock from "/imports/job-nav/IgnoreCustBlock";
import {IJobGroupByCompany} from "/imports/job-nav/types";
import {Table} from "antd";
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

import {showErr} from "/imports/ui/common/antd-wrap";

import {StringHelper} from "@alibobo99/js-helper";

import CompanyMetaBlock from "./CompanyMetaBlock";


const Holder = styled.div`

`;

interface IProps {
  grouped: IJobGroupByCompany[];
}

interface ICompanyBrief {
  group: IJobGroupByCompany;
}

const CompanyBriefHolder = styled.div`
  > .title {
    font-size: 16px;
    color: darkblue;
    font-weight: bold;
    cursor: pointer;
  }

  > .place {
    font-size: 12px;
    color: #555;
    font-style: italic;
  }
`;

function CompanyBrief(props: ICompanyBrief) {
  const {group} = props;
  const {company} = group;
  const {jobAddrNoDesc, custName,custKey} = company;
  const url =`https://www.104.com.tw/company/${custKey}?jobsource=jolist_a_relevance`;
  if(!custKey){
    showErr(`${custKey} undefined!`);
    return ;
  }
  function openCompany(){
    window.open(url,"_blank");
  }
  return (<CompanyBriefHolder>
    <div onClick={openCompany} className={"title"}>{custName}</div>
    <div className={"place"}>{jobAddrNoDesc}</div>
  </CompanyBriefHolder>);

}

function JobGroupByCompanyTable(props: IProps) {
  const {grouped} = props;

  useEffect(() => {

    if(StringHelper.isBlank("")){
      console.log("GO");
    }
  }, []);
  if (grouped) {

  }

  const columns = [
    {
      title: '公司',
      dataIndex: ['company', 'custName'],
      key: 'custName',
      width: 100,
      render: (value, record) => {
        return (<CompanyBrief group={record}/>);
      }
    },
    {
      title: '徵才數',
      dataIndex: 'jobCount',
      key: 'jobCount',
      width: 50,
      sorter:(a,b)=>{
        return a.jobCount-b.jobCount;
      },
    },
    {
      title: '員工數',
      key: 'emp',
      width: 50,
      sorter:(a,b)=>{
        return a.jobs[0].empNoN -b.jobs[0].empNoN;
      },
      render: (record) => {
        const {jobs} = record;
        return jobs[0].empNoN;
      }
    },
    {
      title: '',
      key: 'pad',
      width: 150,
      render: (record) => {
        return(<div></div>);
      }
    },

  ];

  function expandedRowRender(record) {
    return(<div>
      <IgnoreCustBlock company={record.company} />
      <CompanyMetaBlock custNo={record.custNo}  />
      <CompanyJobsExtend group={record} />
    </div>);
  }

  return (
    <Table
      bordered
      size={"small"}
      pagination={{position: 'both'}}
      dataSource={grouped}
      columns={columns}
      expandedRowRender={expandedRowRender}
      rowKey={(r) => {
        return r.custNo;
      }}
    />

  );
}


export function JobGroupByCompanyTable_ForStory(props: IProps) {
  return (<JobGroupByCompanyTable {...props} />);
}

export default JobGroupByCompanyTable;
