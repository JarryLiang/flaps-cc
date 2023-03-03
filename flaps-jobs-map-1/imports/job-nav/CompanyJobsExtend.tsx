import {JsonButton} from "/imports/components/json-view-dialog/JsonViewBlock";
import {IJobGroupByCompany} from "/imports/job-nav/types";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import OmHelper from 'client/OmHelper';
import classNames from 'classnames';

import {
  Button, message, JsonTabSwitchView, Icon, showErr, tryCall, showMsg,
} from 'components/ui-elements';


const Holder = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  >.item-holder {
    max-width: 250px;
    color: #222;
    font-weight: bold;
    word-break: break-all;
    font-size: 16px;
    display: inline-block;
    margin: 4px;
    padding: 8px;
    border-radius: 4px;
    border: solid 1px #CCC;
  }
`;

interface IProps {
  group: IJobGroupByCompany;
}

function CompanyJobsExtend(props:IProps) {
  const {group} = props;


  useEffect(()=>{

  },[]);

  function renderItems(){
    const {jobs}=group;
    const views=jobs.map((job)=>{
      const {jobNo,jobName} = job;
      return (<div className={"item-holder"} key={jobNo}>
        {jobName}
        <JsonButton data={job} title={"J"} small/>
      </div>);
    })
    return views;
  }

  return (
    <Holder>
      {renderItems()}
    </Holder>
  );
}


export function CompanyJobsExtend_ForStory(props:IProps){
 return (<CompanyJobsExtend {...props} />);
}

export default CompanyJobsExtend;
