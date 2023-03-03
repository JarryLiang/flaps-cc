import {TRawJob} from "/imports/job-nav/common";
import {TJobAndCust} from "/server/data-104/datatype";

export interface ICompany {
  "custNo": string,
  "custName": string,
  "coIndustryDesc": string,
  "jobAddrNoDesc": string,
  custKey:string;
}

export interface IJobGroupByCompany {
  custNo:string;
  company: ICompany,
  jobs: TJobAndCust[],
  jobCount: number;
}
