import {SpinText} from "/imports/components/SpinText/SpinText";
import {JobClientUtils} from "/imports/job-nav/JobClientUtils";
import JobGroupByCompanyTable from "/imports/job-nav/JobGroupByCompanyTable";
import JsonPre from "/imports/ui/common/JsonPre";
import {MeteorCommon} from "/imports/utils/MeteorCommon";
import {PromiseHelper} from "/imports/utils/PromiseHelper";
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import OmHelper from 'client/OmHelper';
import classNames from 'classnames';

import {
  Button, message, JsonTabSwitchView, Icon, showErr, tryCall, showMsg,
} from 'components/ui-elements';


const Holder = styled.div`

`;

interface IProps {
  coIndustryDesc: string;
}

function CompanyOfIndustryView(props: IProps) {
  const {coIndustryDesc} = props;

  const [companies, setCompanies] = useState([]);
  const [groupBy, setGroupBy] = useState([]);
  const [loading,setLoading ] = useState(false);

  async function loadCompanies() {
    setLoading(true);
    const raw = await MeteorCommon.simpleCall("companies.loadByIndustry", coIndustryDesc) as string;
    const cc = JSON.parse(raw);
    const gb = JobClientUtils.groupByCompany(cc)
    setCompanies(cc);
    setGroupBy(gb);
    setLoading(false);
  }

  useEffect(() => {
    PromiseHelper.simpleProcess(loadCompanies());
  }, []);


  return (
    <Holder>
      {loading &&(<SpinText title={"Loading"} />)}
      <JobGroupByCompanyTable grouped={groupBy}/>
    </Holder>
  );
}


export function CompanyOfIndustryView_ForStory(props: IProps) {
  return (<CompanyOfIndustryView {...props} />);
}

export default CompanyOfIndustryView;
