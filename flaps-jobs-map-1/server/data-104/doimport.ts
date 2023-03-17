import {FieldConvUtils} from "/imports/utils/FieldConvUtils";

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




function removeDot(s:string):string{
  let ns = s;
  while(ns.indexOf(".")>=0){
    ns=ns.replace(".","_");
  }
  return ns;
}

function checkKeyWithDot(j: any) {

  const result:{[key:string]:any} = {};
  Object.keys(j).forEach((k)=>{
    let value = j[k];
    if(typeof (value)==='object'){
       value = checkKeyWithDot(value);
    }
    if(k.indexOf(".")>=0){
      const newKey=removeDot(k);
      result[newKey]=value;
    }else {
      result[k]=value;
    }
  });
  return result;
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

  // @ts-ignore
  allJobs=allJobs.map((j)=>{
    return checkKeyWithDot(j);
  });
  Job104.updateJobs(allJobs).then(()=>{
    console.log("complete import job:"+allJobs.length);
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


  for await (const item of list){
    const company= fetchCompany(item.fullPath);
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

      try{
        await Cust104.upsertCust([company]);
        if(delFile){
          fs.unlinkSync(item.fullPath)
          console.log(`del ${item.fullPath} `);
        }
      }catch (e){
        console.error(e)
        console.error(item.fullPath);
      }

    }
  }


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
  return "遮蔽";

  //return ListOP.sumByKey(ll,r=>r.empNoN);


}

export const ImportTasks = {
  importJobs,
  importCompanies,
  exportCapl,
  exportEmp,
}

