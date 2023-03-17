import {FieldConvUtils} from "/imports/utils/FieldConvUtils";
import {Dictionary} from "/index";
import {CacheApi} from "/server/api/CacheApi";
import {CollectionUtils} from "/server/api/CollectionUtils";
import {ICustBase, ICustCommon} from "/server/data-104/datatype";
import {StringHelper} from "@alibobo99/js-helper";


import {Mongo} from "meteor/mongo";

export const Cust104Collection = new Mongo.Collection('cust104');

export const Cust104MetaCollection = new Mongo.Collection('cust104Meta');


async function getExistCustNo(): Promise<Dictionary<boolean>> {
  const mm = await CollectionUtils.getUniqueValue(Cust104Collection, "custNo");
  return mm;
}

async function insertCustBase(custs: ICustBase[]) {
  if (custs.length == 0) {
    return;
  }

  const existNos: Dictionary<boolean> = await getExistCustNo();
  const toInsertArray = [];
  for await (const cust of custs) {
    if (!existNos[cust.custNo]) {
      existNos[cust.custNo] = true;
      //insert
      const toInsert = {
        _id: cust.custNo,
        ...cust
      }
      toInsertArray.push(toInsert);
    }
  }
  if (toInsertArray.length > 0) {
    // @ts-ignore
    Cust104Collection.batchInsert(toInsertArray);
  }
}

async function updateJobsCount(aggs: {count: any; key: string}[]) {
  for await (const agg of aggs){
    const {count,key} = agg;
    const sel = {custNo:key};
    await Cust104Collection.update(sel, {$set:{jobCount:count}});
  }
}

async function loadCompanies() {
  const fields = {
    custNo:1,
    custKey:1,
    custName:1,
    industryDesc:1,
    indcat:1,
    ignore:1,
    empNo:1,
    capital:1,
    custLink:1,
    jobCount:1,
    addrNoDesc:1,
    logo:1,
  }
  console.log("Load Company")
  return Cust104Collection.find({},{fields:fields}).fetch();
}



async function upsertCust(companies: ICustCommon[]) {
  for await (const cust of companies){
    const sel = {_id:cust._id};
    if(StringHelper.isBlank(cust._id)){
      throw "null id";
    }
    await Cust104Collection.upsert(sel, {$set:cust});
  }
}
async function loadIgnoreCompanies():Promise<ICustCommon[]> {
  const fields = {
    "_id": 1,
    "custNo":1,
    "custName":1,
    "custKey": 1,
    "jobCount": 1,
    "empNo": 1,
  };
  const result:ICustCommon[] = await Cust104Collection.find({ignore:true},{fields:fields}).fetch() as ICustCommon[];
  return result;
}

async function loadCompaniesForMap():Promise<ICustCommon[]> {
  const fields = {
    custNo:1,
    custKey:1,
    custName:1,
    industryDesc:1,
    indcat:1,
    ignore:1,
    empNo:1,
    capital:1,
    jobCount:1,
    capitalN:1,
    empNoN:1,
  };
  let ll:ICustCommon[] = await Cust104Collection.find({},{fields:fields}).fetch() as ICustCommon[];
  // @ts-ignore
  ll= ll.map((r)=>{
    return FieldConvUtils.removeNull(r);
  });
  return ll;
}



async function updateEmpNo() {

  const fields = {
    _id:1,
    empNo:1
  }

  const ll:ICustCommon[]=await Cust104Collection.find({},{fields}).fetch() as ICustCommon[];
  for await (const cust of ll){
    const {empNo} = cust;
    if(empNo){
      const v=FieldConvUtils.parseEmpNo(empNo);
      if(v){
        const sel = {_id:cust._id};
        const toSet = { empNoN: v || "N/A"}
        await Cust104Collection.update(sel,{$set:toSet},{multi:false});
      }
    }
  }

};
async function updateCapl() {

  const fields = {
    _id:1,
    capital:1
  }

  const ll:ICustCommon[]=await Cust104Collection.find({},{fields}).fetch() as ICustCommon[];
  for await (const cust of ll){
    const {capital} = cust;
    if(capital){
      const v=FieldConvUtils.parseCap(capital);
      if(v){
        const sel = {_id:cust._id};
        const toSet = { capitalN: v || "N/A"}
        await Cust104Collection.update(sel,{$set:toSet},{multi:false});
      }
    }
  }

}

async function getMeta(custNo: any) {
  const sel = {
    custNo
  }

  const row =await Cust104MetaCollection.findOne(sel);
  if(!row){
    return {};
  }
  // @ts-ignore
  return row["meta"] || {};
}

async function setMeta(custNo: any, meta: any) {
  const sel = {
    _id:custNo,
  }
  const toSet = {
    _id:custNo,
    custNo,
    meta
  }
  await Cust104MetaCollection.upsert(sel,{$set:toSet},{multi:false});
}

// async function seperate() {
//   const ll=await Cust104Collection.find({},{fields:{custNo:1,ignore:1}}).fetch();
//   const m = {}
//   ll.forEach((l)=>{
//     const {custNo,ignore} = l;
//     if(ignore){
//       m[custNo] = ignore;
//     }
//   });
//   const value =JSON.stringify(m);
//
// }

async function saveIgnoreRaw(raw:any){
  let value:any = raw;

  if(typeof (raw) !=="string") {
    value = JSON.stringify(raw);
  }
  await CacheApi.saveItem("ignoreCust104",value);
}


let _ignoreCache:any = null;
let _ignoreCacheRaw:any = null;


async function updateIgnore(custNo: string, value: boolean) {
  if(!_ignoreCache){
    await loadIgnoreRaw();
  }

  _ignoreCache[custNo] = value;

  // @ts-ignore
  _ignoreCacheRaw = JSON.stringify(_ignoreCache);
  await saveIgnoreRaw(_ignoreCacheRaw);
}


async function loadIgnoreRaw(){
  if(!_ignoreCache){
    const value = await CacheApi.loadItem("ignoreCust104");
    if(!value){
      _ignoreCache = {};
      _ignoreCacheRaw =  JSON.stringify({});
      return _ignoreCacheRaw;
    }else{

      _ignoreCacheRaw= value;
      // @ts-ignore
      _ignoreCache=JSON.parse(_ignoreCacheRaw);
      return value;
    }
  }
  return _ignoreCacheRaw;

}



export const Cust104 = {
  insertCustBase,
  updateJobsCount,
  loadCompanies,
  updateIgnore,
  upsertCust,
  loadIgnoreCompanies,
  loadCompaniesForMap,
  Cust104Collection,
  updateEmpNo,
  updateCapl,
  getMeta,
  setMeta,
  saveIgnoreRaw,
  loadIgnoreRaw
}


