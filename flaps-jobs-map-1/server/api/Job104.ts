import {DigestUtils} from "/imports/utils/Digest";
import {FieldConvUtils} from "/imports/utils/FieldConvUtils";
import {ListOP} from "@alibobo99/js-helper";
import {getByPath} from "/imports/utils/obj-helper";
import {Dictionary} from "/index";
import {Cust104} from "/server/api/Cust104";
import {FileCacheApi} from "/server/api/FileCacheApi";
import {Job104StatusApi} from "/server/api/Job104StatusApi";
import {ICustBase, TJob104} from "/server/data-104/datatype";
import {Mongo} from "meteor/mongo";
import {AreaMap} from "/server/data-104/area_";


export const Job104Collection = new Mongo.Collection('job104');


function extractFindalSegFromUrl(url:string):string|undefined{
  try{
    const l1=url.split("?")[0]
    const l2= l1.split("/");
    return l2[l2.length-1];
  }catch (e){
    return undefined;
  }

}



async function getAllJobNos():Promise<Dictionary<boolean>>{
  const ll:TJob104[] = await Job104Collection.find({},{fields:{jobNo:1}}).fetch() as TJob104[];
  const result:Dictionary<boolean> = {};
  ll.forEach((l)=>{
    result[l.jobNo]=true;
  });
  return result;
}

async function updateJobs(jobs:TJob104[]){
  const existJobNos:Dictionary<boolean> = await getAllJobNos();
  const remains:TJob104[] = [];
  jobs.forEach((j)=>{
    const {jobNo} = j;
    if(existJobNos[jobNo]){
      return;
    }
    // @ts-ignore
    existJobNos[jobNo]=true;
    remains.push(j);
  });

  if(remains.length==0){
    return;
  }

  const toAdd= remains.map((j)=>{
    return {
      ...j,
      _id:j.jobNo,
    }
  })
  // @ts-ignore
  await Job104Collection.batchInsert(toAdd);


}

async function refreshCompanyFromJobs() {
  const fds = {
    _id:0,
    custNo:1,
    custName:1,
    custNameRaw:1,
    link:1,
  }

  const ll:ICustBase[] = await Job104Collection.find({},{fields:fds}).fetch() as ICustBase[];
  const ll2=ll.map((item)=>{
    // @ts-ignore
    const {link}= item;
    const custKey=extractFindalSegFromUrl(link.cust);
    // @ts-ignore
    delete item["link"];
    return {
      ...item,
      custKey:custKey
    }
  });
  await Cust104.insertCustBase(ll2);

}

async function loadByIndustryAndAggToCompany(coIndustryDesc: any) {
  const fields = {
    jobNo:1,
    jobName:1,
    jobAddrNo:1,
    jobAddrNoDesc:1,
    custNo:1,
    custName:1,
    coIndustryDesc:1,
    area1Des:1,
    area1No:1,
    area2Des:1,
    area2No:1,
    empNoN:1,
  }
  const ll=Job104Collection.find({coIndustryDesc},{fields}).fetch() as TJob104[];
  return JSON.stringify(ll);



}

async function refreshJobCount(){
  const fds = {
    _id:0,
    custNo:1,
  }
  const ll:ICustBase[] = await Job104Collection.find({},{fields:fds}).fetch() as ICustBase[];
  // @ts-ignore
  const agg = ListOP.aggByKeyAndSort(ll,(r)=>{ return r.custNo});
  await Cust104.updateJobsCount(agg);
}
async function fixArea(){
  const fields = {
    _id:0,
    custNo:1,
    jobAddrNo:1,
    des:1,
  }
  const ll:TJob104[] = await Job104Collection.find({},{fields}).fetch() as TJob104[];
  for await (const j of ll){
    // @ts-ignore
    const {custNo,jobAddrNo,des} = j;
    // @ts-ignore
    const area = AreaMap[jobAddrNo];
    if(!des){
      if(area){
        const sel = {custNo}
        await Job104Collection.update(sel, {$set:area});
      }
    }
  }
  console.log("complete");

}

/*
let _allJobCache = null;
async function loadAllJobInternal(){
  if(_allJobCache ==null){
    const raw = await FileCacheApi.loadItem("allJob");
    if(!raw){


    }

  }
}
*/



async function loadJobs(opt:any) {

  const cacheKey =`jobs-${DigestUtils.doMD5(JSON.stringify(opt))}`;
  const cached = await FileCacheApi.loadItem(cacheKey);
  if(cached){
    return cached;
  }



  const {skipIgnore,industryFilter} = opt;

  const fields = {
    jobNo:1,
    jobName:1,
    jobAddrNo:1,
    jobAddrNoDesc:1,
    custNo:1,
    custName:1,
    coIndustryDesc:1,
    area1Des:1,
    area1No:1,
    area2Des:1,
    area2No:1,
    empNoN:1,
  }

  let  sel = {

  };
  if(industryFilter.length >0){
   sel = {
     coIndustryDesc:{$in:industryFilter}
   }
  }

  const cc = await Cust104.loadCompaniesForMap();
  // @ts-ignore
  const companyMap = ListOP.listToMap(cc,r=>r.custNo);

  let ll:TJob104[] = await Job104Collection.find(sel,{fields}).fetch() as TJob104[];
  let resultList:TJob104[] = [];
  ll.forEach((l)=>{
    // @ts-ignore
    const company = companyMap[l.custNo];
    if(company) {
      if (skipIgnore) {
        if (company.ignore) {
          return;
        }
      }
      const item = {
        ...l,
        ...company
      }
      resultList.push(item);
    }else {
      resultList.push(l);
    }
  });
  const result = JSON.stringify(resultList);
  await FileCacheApi.saveItem(cacheKey,result);
  return result;
}

async function updateEmpNo() {
  const fields = {
    _id:1,
    tags:1,
    empNoN:1,

  }
  const pp = ["tags","emp","desc"];
  const ll:TJob104[]=await Job104Collection.find({},{fields}).fetch() as TJob104[];
  for await (const cust of ll){
    const {empNoN} = cust;
    if(empNoN){
      continue;
    }
    const emp= getByPath(pp,cust,undefined);
    if(emp){
      const v=FieldConvUtils.parseEmpNo(emp);
      if(v){
        const sel = {_id:cust._id};
        const toSet = { empNoN: v || "N/A"}
        await Job104Collection.update(sel,{$set:toSet},{multi:false});
      }
    }
  }
}

async function summaryByIndustry() {
  const fields = {
    coIndustryDesc:1,
    custNo:1,
    jobNo:1,
  }
  const ll=Job104Collection.find({},{fields}).fetch();
  // @ts-ignore
  const byIndustry = ListOP.aggByKey(ll,r=>r.coIndustryDesc);
  const st =Object.keys(byIndustry).map((coIndustryDesc)=>{
    // @ts-ignore
    const list = byIndustry[coIndustryDesc];
    // @ts-ignore
    const byCust =  ListOP.aggByKey(list,r=>r.custNo);
    const item = {
      coIndustryDesc,
      company:Object.keys(byCust).length,
      jobs:list.length
    }
    return item;
  });

  await Job104StatusApi.saveItem("byIndustry",JSON.stringify(st));


}

async function setIndustryIgnore(toUpdate: any) {
  const raw = await getIndustryIgnoreMap();
  const jj = JSON.parse(raw);

  const newJJ = {
    ...jj,
    ...toUpdate,
  }
  await Job104StatusApi.saveItem("IndustryIgnoreMap",JSON.stringify(newJJ));
}
async function getIndustryIgnoreMap() {
  const v =await Job104StatusApi.getItem("IndustryIgnoreMap");
  if(v){
    return v;
  }
  return  JSON.stringify({});

}



export const Job104 = {
  updateJobs,
  refreshCompanyFromJobs,
  refreshJobCount,
  fixArea,
  loadJobs,
  Job104Collection,
  updateEmpNo,
  summaryByIndustry,
  getIndustryIgnoreMap,
  setIndustryIgnore,
  loadByIndustryAndAggToCompany
}
