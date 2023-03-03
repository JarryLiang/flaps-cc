import {ICompany} from "/imports/job-nav/types";
import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {SwitchInputHook} from "/imports/ui/input/inputs";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import OmHelper from 'client/OmHelper';
import classNames from 'classnames';

import {
  Button, message, JsonTabSwitchView, Icon, showErr, tryCall, showMsg,
} from 'components/ui-elements';
import { Meteor } from "meteor/meteor";


const Holder = styled.div`
  margin-left: 8px;
`;

interface IProps {
  company:ICompany
}

function IgnoreCustBlock(props:IProps) {
  const { company } = props;
  const [ignore,setIgnore ] = useState(company.ignore);
  useEffect(()=>{

  },[]);

  function pressIgnore(v){
    company.ignore = v;
    const { custNo,ignore} = company;
    setIgnore(v);
    Meteor.call("company.updateIgnore",custNo,v,(err,res)=>{

    });

  }

  return (
    <AlignCenterRow>
      <SwitchInputHook checked={ignore} onChange={pressIgnore} />
      <span>下次忽略該公司</span>
      <span></span>
    </AlignCenterRow>
  );
}


export function IgnoreCustBlock_ForStory(props:IProps){
 return (<IgnoreCustBlock {...props} />);
}

export default IgnoreCustBlock;
