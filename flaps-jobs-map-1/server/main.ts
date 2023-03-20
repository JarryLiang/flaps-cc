import {CacheApi} from "/server/api/CacheApi";
import {Cust104} from "/server/api/Cust104";
import {FileCacheApi} from "/server/api/FileCacheApi";
import {Job104} from "/server/api/Job104";
import {Job104StatusApi} from "/server/api/Job104StatusApi";
import {ImportTasks} from "/server/data-104/doimport";
import {StringHelper} from "@alibobo99/js-helper";
import { Meteor } from 'meteor/meteor';





Meteor.methods({
  'once.seperate':async function (){
    //await Cust104.seperate();
  },
  'config.load':async function (){
      const result = await Job104StatusApi.getItem("config");
      if(result){
        return result;
      }
      return null;
  },
  'config.save':async function (raw){
    await Job104StatusApi.saveItem("config",raw);
    return true;
  },
  'jobs.getIndustryIgnoreMap':async function (){
    return Job104.getIndustryIgnoreMap();
  },
  'jobs.setIndustryIgnore':async function (toUpdate){
    return Job104.setIndustryIgnore(toUpdate);
  },
  'jobs.getIndustryStatistic':async function (){
    const result = await Job104StatusApi.getItem("byIndustry");
    if(result){
      return result;
    }
    return null;
  },
  'companies.loadByIndustry':async function (coIndustryDesc){
    return Job104.loadByIndustryAndAggToCompany(coIndustryDesc);
  },
  'jobs.list':async function (opt){
    console.log("start");
    const raw =await Job104.loadJobs(opt);
    console.log(raw.length);
    return raw;
  },
  'company.loadIgnore':async function (){
    const v= await Cust104.loadIgnoreRaw();
    return v;
  },
  'company.getMeta':async function (custNo:string){
    const data = await Cust104.getMeta(custNo) || {};
    return JSON.stringify(data);
  },
  'company.setMeta':async function (custNo:string,meta:any){
    await Cust104.setMeta(custNo,meta);
  },
  'company.list':async function (){
    const value = await CacheApi.loadItem("company.list");

    if(!value) {
      console.log("no company cache");
      const ll = await Cust104.loadCompanies();
      const v = JSON.stringify(ll);
      console.log("company cache size:"+v.length)
      await CacheApi.saveItem("company.list", v);
      return v;
    }else {
      console.log("return cache:"+value.length);
      return value;
    }
  },
  'company.updateIgnore':async function (custNo:string,value:boolean){
    console.log(`${custNo}-${value}`);
    const v =await Cust104.updateIgnore(custNo,value);
    return v;
  },
  'import.jobs':async function (){
    await ImportTasks.importJobs(false);
    await Job104.refreshCompanyFromJobs();
    await Job104.refreshJobCount();
    await Job104.summaryByIndustry();
    console.log("done");
  },
  'import.companies':async function (){
    //await Job104.fixArea();
    await ImportTasks.importCompanies(true);
    console.log("done");
  },
  'info.misc':async function (){
    const empNos = await ImportTasks.exportEmp();
    const capls = await ImportTasks.exportCapl();
    const ignoredCompanies = await Cust104.loadIgnoreCompanies();
    return {
      empNos,
      capls,
      ignoredCount:ignoredCompanies.length,
      ignoredCompanies
    }
  },
  'postproc.fields':async function (){

    await Job104.updateEmpNo();
    await Cust104.updateEmpNo();
    await Cust104.updateCapl();



  },
  "misc.clearCache":async function (){
    await CacheApi.clearCache();
    await FileCacheApi.clearCache();
    return true;
  },
  "ignore.addKeyword":async function (keyword:string){
    if(StringHelper.isBlank(keyword)){
      return;
    }
    await Cust104.addIgnoreKeyword(keyword);
  },
  "ignore.loadKeyword":async function (){
    return Cust104.loadIgnoreKeyword();
  }

})


Meteor.startup(async () => {
  const run = true;
  if(run){
    // await ImportJobs.exportCapl();
    // ;

    //
  }else {
    console.log("skip");
  }

});

