import {JsonButton} from "/imports/components/json-view-dialog/JsonViewBlock";
import {JobClientUtils} from "/imports/job-nav/JobClientUtils";
import {TJobAndCust} from "/server/data-104/datatype";
import React, {useState} from 'react';
import styled from 'styled-components';
import {ITagItem, ITreeMapConfig, ITreeMapLevelNode} from "../components/foam-treemap-def";
import GenericTreeMapSmall from "../components/generic-treemap-small";

import {showErr} from "/imports/ui/common/antd-wrap";
import {Button} from "antd";

import {TRawJob} from "/imports/job-nav/common";

import JobGroupByCompanyTable from "/imports/job-nav/JobGroupByCompanyTable";

import {ISuggestLayout, TreeMapDefs} from "../components/foam-treemap-def";
import {ICompany, IJobGroupByCompany} from "./types";


const _finalLevels: ITagItem[] = [
  {
    label: 'job',
    value: 'job'
  },
]

const PredefinedLevels: ITagItem[] = [
  {
    label: 'area1',
    value: 'area1Des'
  },
  {
    label: 'area2',
    value: 'area2Des'
  },
  {
    label: 'company',
    value: 'custName'
  },
  {
    label: '產業',
    value: 'coIndustryDesc'
  },
  {
    label: '員工',
    value: 'empSeg'
  },
  {
    label: '資本',
    value: 'capSeg'
  },
  {
    label: 'Job',
    value: 'jobName'
  },


]


const levelProcessors = {
  area1Des: TreeMapDefs.normalLevelProcessor,
  area2Des: TreeMapDefs.normalLevelProcessor,
  custName: TreeMapDefs.normalLevelProcessor,
  coIndustryDesc: TreeMapDefs.normalLevelProcessor,
  empSeg: TreeMapDefs.normalLevelProcessor,
  capSeg: TreeMapDefs.normalLevelProcessor,
  jobName: TreeMapDefs.normalLevelProcessor,
}

function prepareFinalLevelLabel(record: TRawJob) {
  const {jobNameRaw} = record;
  return jobNameRaw;
}

function justOneFinalLevelProcessor(record: TRawJob) {
  //  const info = prepareCommonInfo(record);

  const result: ITreeMapLevelNode = {
    id: record.jobNo,
    label: prepareFinalLevelLabel(record),
    type: 'record',
    weight: 1,
    realWeight: 1,
    record,
  }
  return result;
}


const finalLevelProcessors = {
  job: justOneFinalLevelProcessor,
}

const levelPath = {}
const DrawerHolder = styled.div`
  ;



`;


interface IProps {
  records: TJobAndCust[];
}


function genSuggestLayout(title: string, desc: string, levs: string[], finalLv: string): ISuggestLayout {
  const suggestLevels = levs.map((v) => {
    const t = PredefinedLevels.find((ll) => {
      return ll.value === v;
    });
    return t;
  });

  const finalLevel = _finalLevels.find((f) => {
    return f.value === finalLv;
  })

  // @ts-ignore
  const result: ISuggestLayout = {title, desc, suggestLevels, finalLevel}
  return result;
}

const suggestLayout: ISuggestLayout[] = [
  genSuggestLayout(
    "CompanySize",
    "",
    ["empSeg", "coIndustryDesc", "custName"],
    "job"),
];



interface IProps2 {
  group: IJobGroupByCompany
}


const JobGroupByCompanyViewHolder = styled.div`
  > .header {
    display: grid;
    grid-template-columns: 40px 1fr;

    > .title {
      cursor: pointer;
    }

    > .flip {

    }
  }

  > .jobs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));

    > .job-item {
      margin: 4px;
      border-radius: 4px;
      border: solid 1px #CCC;
      padding: 4px;
      word-break: break-all;

      > .job-title {
        cursor: pointer;
      }

      > .pay {

      }
    }
  }
`;

function JobGroupByCompanyView(props: IProps2) {
  const {group} = props;
  const {company, jobs, jobCount} = group;
  const [expend, setExpend] = useState(jobCount <= 3);

  function handleClickCompany() {
    //window.open(company.company_href,"_blank");
  }

  function handleClickJob(href: string) {
    window.open(href, "_blank");
  }

  function toggleExpand() {
    setExpend(!expend);
  }

  const jobViews = jobs.map((j) => {
    const {
      jobNo, link, jobNameRaw,

    } = j;
    return (<div key={jobNo} className={"job-item"} onClick={() => {
      handleClickJob(link)
    }}>
      <div className={"job-title"}>{jobNameRaw}</div>
      {/*<div className={"pay"}>{providesalary_text}</div>*/}
    </div>)
  })
  const icon = expend ? "up" : "down";
  return (<JobGroupByCompanyViewHolder>
    <div className={"header"}>
      <div className={"flip"} onClick={toggleExpand}>
        <Button icon={icon}/>
      </div>
      <div className={"title"} onClick={handleClickCompany}>
        <div>{company.custNameRaw}</div>
        <div>Jobs:{jobCount}</div>
      </div>
    </div>
    {expend && (<div className={"jobs"}>
      {jobViews}
    </div>)}
  </JobGroupByCompanyViewHolder>);
}

/******************************************************/


function JobNav(props: IProps) {

  const {records} = props;
  const [grouped, setGrouped] = useState<IJobGroupByCompany[]>([]);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const treeMapConfig: ITreeMapConfig = {
    finalLevels: _finalLevels,
    levels: PredefinedLevels,
    defaultLevels: [
      {
        label: '產業',
        value: 'coIndustryDesc'
      },
      {
        label: '員工',
        value: 'empSeg'
      },
      {
        label: 'company',
        value: 'custName'
      },
      {
        label: 'Job',
        value: 'jobName'
      }
    ],
    finalLevelProcessors,
    levelProcessors,
    levelPath,
    recordPreFilters: []
  }

  // @ts-ignore
  function handleBeforeApply(levels: ITagItem[], finalLevel: string) {
    if (levels.length <= 2) {
      showErr("Too few levels");
      return false;
    }
    return true;
  }

  // @ts-ignore

  function onClickTreeGroup(group: any) {

    if (group.levelType) {
      // @ts-ignore
      const all: TJobAndCust[] = [];
      // @ts-ignore
      JobClientUtils.mergeGroups(all, group);
      const _groupBy = JobClientUtils.groupByCompany(all);
      // @ts-ignore
      setSelectedRecords(all);
      setGrouped(_groupBy);
      if(group.levelType==='custName'){
        if((group.id.indexOf("custName-80")>=0){
          return false;
        }
        if((group.id.indexOf("custName-20")>=0){
          return false;
        }
        return true;
      }
    } else {
      // @ts-ignore
      setSelectedRecords([group.record]);
    }
    return false;

  }

  function renderSelected() {
    if (grouped.length == 0) {
      return null;
    }

    const views = grouped.map((g) => {
      const {company} = g; //,jobs,jobCount
      const {custNo} = company; //,custNameRaw
      //const text=`${custNameRaw}- (${jobCount})`;
      return (<JobGroupByCompanyView key={custNo} group={g}/>);
    });

    // @ts-ignore
    const defaultKey = [];
    if (grouped.length == 1) {
      defaultKey.push(grouped[0].company.custNo);
    }
    return (<>
        <JobGroupByCompanyTable grouped={grouped}/>
      </>);
  }

  function renderDrawer(visible: boolean) {
    if (visible) {
      if (selectedRecords.length > 0) {
        return (<DrawerHolder>
          {renderSelected()}
        </DrawerHolder>);
      }
    }
    return null;
  }


  return (<GenericTreeMapSmall
    treeMapConfig={treeMapConfig}
    records={records}
    defaultFinalLevel={"job"}
    suggestLayouts={suggestLayout}
    beforeApply={handleBeforeApply}
    onClickTreeGroup={onClickTreeGroup}
    renderDrawer={renderDrawer}
  />);
}


export default JobNav;
