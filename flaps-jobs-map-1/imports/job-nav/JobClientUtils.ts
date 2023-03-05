
import {ICompany, IJobGroupByCompany} from "/imports/job-nav/types";

// @ts-ignore
import {TJobAndCust} from "/server/data-104/datatype";

function mergeGroups(allRecords, group) {
  if (group.levelType) {
    const {groups} = group;
    console.log(groups.length);
    groups.forEach((g: any) => {
      mergeGroups(allRecords, g);
    });
  } else {
    allRecords.push(group.record);
  }
}

function groupByCompany(allrec: TJobAndCust[]) {
  const companiesMap: {
    [key: string]: IJobGroupByCompany
  } = {};


  allrec.forEach((j) => {
    // @ts-ignore
    const {
      custNo, custName, coIndustryDesc, jobAddrNoDesc,
      custKey,ignore
    } = j;
    let item = companiesMap[custNo];
    if (!item) {
      const company: ICompany = {
        custNo,
        custName,
        coIndustryDesc,
        jobAddrNoDesc,
        custKey,
        ignore
      }
      item = {
        custNo,
        company,
        jobs: [j],
        jobCount: 1
      }
      companiesMap[custNo] = item;
    } else {
      item.jobs.push(j);
      item.jobCount = item.jobCount + 1;
    }
  });
  const ll = Object.keys(companiesMap).map((k) => {
    return companiesMap[k];
  });
  ll.sort((a, b) => {
    return b.jobCount - a.jobCount;
  })
  return ll;

}


export const JobClientUtils = {
  mergeGroups,
  groupByCompany
}
