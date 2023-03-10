import {FieldConvUtils} from "/imports/utils/FieldConvUtils";
import {ListOP} from "/imports/utils/ListOP";
import {getByPath} from "/imports/utils/obj-helper";
import {Dictionary} from "/index";
import {CollectionUtils} from "/server/api/CollectionUtils";
import {Cust104, Cust104Collection} from "/server/api/Cust104";
import {Job104Collection} from "/server/api/Job104";
import {Job104} from "/server/api/Job104";
import {Job104StatusApi} from "/server/api/Job104StatusApi";
import {ICustCommon, TJob104} from "/server/data-104/datatype";
import {FsUtils, IFileItem} from "/server/data-104/FsUtils";
import * as fs from "fs";

import {AreaMap} from "/server/data-104/area_";

//const root ="D:\\download";

async function getRootPath():Promise<string>{
  const r = await Job104StatusApi.getConfigItem("jsonImportPath","D:\\download");
  return r;
}

function fetchCompany(fileName: string):ICustCommon|undefined {
  try{
    const text = FsUtils.readTextFileSync(fileName);
    const jo=JSON.parse(text);
    const {result} = jo;
    const cust:ICustCommon = result.data;
    if(cust){
      const {custNo} = cust;
      if(!custNo){
        return undefined;
      }
      //convert to string
      cust.custNo =`${custNo}`;
      cust._id =cust.custNo;
      return cust;
    }
  }catch (e){

  }
  return undefined;

}

function fetchJobs(fileName:string):TJob104[]{
  try{
    const text = FsUtils.readTextFileSync(fileName);
    const jo=JSON.parse(text);
    const {result} = jo;
    const jr = JSON.parse(result);
    const {data} = jr;
    const list:TJob104[] = data.list;
    return list;

  }catch (e){
    return [];
  }
}


async function importJobs(delFile?:boolean){
  const root:string = await getRootPath();
  const list:IFileItem[]=FsUtils.loopScanFile(root,(f)=>{
    if(f.indexOf("clawer104-search_jobs")>=0){
      return true;
    }
    return false;
  });

  const mm:Dictionary<TJob104> = {};

  list.forEach((item)=>{
    const ll:TJob104[] = fetchJobs(item.fullPath);
    if(delFile){
      fs.unlinkSync(item.fullPath)
    }
    ll.forEach((j)=>{
      const {jobNo} = j;
      if(!mm[jobNo]){
        mm[jobNo]= j;
      }
    });
  });


  let allJobs:TJob104[] = Object.values(mm);

  const pp = ["tags","emp","desc"];
  allJobs=allJobs.map((j)=>{
    //process EmpNoN =>
    const emp= getByPath(pp,j,undefined);
    if(emp){
      const v=FieldConvUtils.parseEmpNo(emp);
      if(v){
       // @ts-ignore
        j.empNoN = v;
      }
    }

    const {jobAddrNo}= j;
    // @ts-ignore
    if(AreaMap[jobAddrNo]){
      // @ts-ignore
      const area = AreaMap[jobAddrNo];
      const {no,...rest} = area;
      return {
        ...j,
        ...rest
      }
    }else {
      return j;
    }
  });

  Job104.updateJobs(allJobs).then(()=>{
    console.log("complete");
  })

}



async function importCompanies(delFile?:boolean) {
  const filter ="clawer104-company-";
  const root = await getRootPath();
  const list:IFileItem[]=FsUtils.loopScanFile(root,(f)=>{
    if(f.indexOf(filter)>=0){
      return true;
    }
    return false;
  });

  const companies:ICustCommon[] =[];
  list.forEach((item)=>{
    const company= fetchCompany(item.fullPath);
    if(delFile){
      fs.unlinkSync(item.fullPath)
      console.log(`del ${item.fullPath} `);
    }
    if(company){
      //==>
      const {capital,empNo} = company;
      if(empNo) {
        const v = FieldConvUtils.parseEmpNo(empNo);
        if(v){
          // @ts-ignore
          company.empNoN=v;
        }
      }
      if(capital) {
        const v = FieldConvUtils.parseCap(capital);
        if (v) {
          // @ts-ignore
          company.capitalN=v;
        }
      }

      companies.push(company);
    }
  });
  await Cust104.upsertCust(companies);




}


async function exportCapl() {
  return CollectionUtils.enumField(Cust104Collection,"capital");
}

async function exportEmp() {
  const fields = {
    _id:0,
    empNoN:1
  }
  let  ll=await Job104Collection.find({},{fields}).fetch()
  ll =ll.filter((r)=>{
    // @ts-ignore
    return !!r.empNoN;
  });
  return "??????";

  //return ListOP.sumByKey(ll,r=>r.empNoN);


}

export const ImportJobs = {
  importJobs,
  importCompanies,
  exportCapl,
  exportEmp,
}

