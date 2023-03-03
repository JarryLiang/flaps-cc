import {Dictionary} from "/index";


export interface TZoneForeign {
  desc: string;
  param: number;
}

export interface TEmp {
  desc: string;
  param: string;
}

export interface Tags {
  zoneForeign: TZoneForeign;
  emp: TEmp;
}

export interface TLink {
  applyAnalyze: string;
  job: string;
  cust: string;
}

export interface TJob104 {
  _id:string;
  jobNo: string;
  jobType: string;
  jobName: string;
  jobNameSnippet: string;
  jobRole: string;
  jobRo: string;
  jobAddrNo: string;
  jobAddrNoDesc: string;
  jobAddress: string;
  description: string;
  descWithoutHighlight: string;
  optionEdu: string;
  period: string;
  periodDesc: string;
  applyCnt: string;
  applyType: number;
  applyDesc: string;
  custNo: string;
  custName: string;
  coIndustry: string;
  coIndustryDesc: string;
  salaryLow: string;
  salaryHigh: string;
  salaryDesc: string;
  s10: string;
  appearDate: string;
  appearDateDesc: string;
  optionZone: string;
  isApply: string;
  applyDate: string;
  isSave: string;
  descSnippet: string;
  tags: Tags;
  landmark: string;
  link: TLink;
  jobsource: string;
  jobNameRaw: string;
  custNameRaw: string;
  lon: string;
  lat: string;
  remoteWorkType: number;
  major: any[];
  salaryType: string;
  dist: string;
  mrt: string;
  mrtDesc: string;
  //=====
  empNoN?:number;
}

export interface ICustBase {
  custNo: string;
  custName: string;
  custNameRaw: string;
  custKey: string | undefined;
  ignore?: boolean;
}

export interface IEnvPicture {
  auto_no: any;
  custno: any;
  file: string;
  description: string;
  is_cover: number;
  type: number;
  input_date: string;
  update_date: string;
  picture_sort: number;
  link_l: string;
  link_s: string;
}

export interface ICustCommon {
  _id:string;
  custNo: string;
  custSwitch: string;
  custName: string;
  industryDesc: string;
  indcat: string;
  empNo: string;
  capital: string;
  address: string;
  industryArea?: any;
  custLink: string;
  profile: string;
  product: string;
  welfare: string;
  management: string;
  phone: string;
  fax: string;
  hrName: string;
  lat: string;
  lon: string;
  logo: string;
  news: string;
  newsLink: string;
  zone: Dictionary<string>;
  linkMore: Dictionary<string>;
  corpImage2: string;
  corpImage1: string;
  corpImage3: string;
  corpLink2: string;
  corpLink1: string;
  corpLink3: string;
  productPictures: any[];
  envPictures: IEnvPicture[];
  tagNames: string[];
  legalTagNames: string[];
  historys: any[];
  isSaved: boolean;
  isTracked: boolean;
  addrNoDesc: string;
  reportUrl: string;
  postalCode: number;
  //=
  capitalN:number;
  empNoN:number;
}


export interface TJobAndCust {
  _id:string;
  jobNo: string;
  jobType: string;
  jobName: string;
  jobNameSnippet: string;
  jobRole: string;
  jobRo: string;
  jobAddrNo: string;
  jobAddrNoDesc: string;
  jobAddress: string;
  description: string;
  descWithoutHighlight: string;
  optionEdu: string;
  period: string;
  periodDesc: string;
  applyCnt: string;
  applyType: number;
  applyDesc: string;
  custNo: string;
  custName: string;
  coIndustry: string;
  coIndustryDesc: string;
  salaryLow: string;
  salaryHigh: string;
  salaryDesc: string;
  s10: string;
  appearDate: string;
  appearDateDesc: string;
  optionZone: string;
  isApply: string;
  applyDate: string;
  isSave: string;
  descSnippet: string;
  tags: Tags;
  landmark: string;
  link: TLink;
  jobsource: string;
  jobNameRaw: string;
  custNameRaw: string;
  lon: string;
  lat: string;
  remoteWorkType: number;
  major: any[];
  salaryType: string;
  dist: string;
  mrt: string;
  mrtDesc: string;
  //=====
  empNoN?:number;


  custSwitch: string;
  industryDesc: string;
  indcat: string;
  empNo: string;
  capital: string;
  address: string;
  industryArea?: any;
  custLink: string;
  profile: string;
  product: string;
  welfare: string;
  management: string;
  phone: string;
  fax: string;
  hrName: string;

  logo: string;
  news: string;
  newsLink: string;
  zone: Dictionary<string>;
  linkMore: Dictionary<string>;
  corpImage2: string;
  corpImage1: string;
  corpImage3: string;
  corpLink2: string;
  corpLink1: string;
  corpLink3: string;
  productPictures: any[];
  envPictures: IEnvPicture[];
  tagNames: string[];
  legalTagNames: string[];
  historys: any[];
  isSaved: boolean;
  isTracked: boolean;
  addrNoDesc: string;
  reportUrl: string;
  postalCode: number;
  //=
  capitalN:number;


}

