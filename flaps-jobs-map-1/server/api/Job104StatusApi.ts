import {Mongo} from "meteor/mongo";


export const Job104StatusCollection = new Mongo.Collection('job104status');

async function  saveItem(key: string, value: string) {
  const sel = {_id:key};
  const toSet = {
    _id:key,
    key:key,
    value
  }
  await Job104StatusCollection.upsert(sel, {$set:toSet},{multi:false});
  return 1;
}

async function getItem(key:string){
  const sel = {_id:key};
  const row = Job104StatusCollection.findOne(sel);
  if(row){
    // @ts-ignore
    return row.value;
  }
  return undefined;
}

async function getConfigItem(key:string,defauleValue:any){
    const raw= await getItem("config");
    if(raw){
      try{
        const jo =JSON.parse(raw);
        return jo[key] || defauleValue;
      }catch (e){
      }
    }
    return defauleValue;
}

export const Job104StatusApi = {
  saveItem,
  getItem,
  getConfigItem
}
