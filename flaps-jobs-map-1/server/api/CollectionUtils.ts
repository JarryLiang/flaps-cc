import {Dictionary} from "/index";
import {Cust104Collection} from "/server/api/Cust104";
import { Mongo } from "meteor/mongo";
import {ListOP} from "/imports/utils/ListOP";



// @ts-ignore
async function getUniqueValue(col: Mongo.Collection, fieldName: string):Promise<Dictionary<boolean>> {
  const fields = {
    [fieldName]:1
  }
  const ll:any[] = await col.find({},{fields:fields}).fetch() as any[];
  const mm:Dictionary<boolean>= ListOP.listToMap(ll,(r)=> {
    return r[fieldName]
  });
  return mm;
}

async function enumField(col: Mongo.Collection, fieldName: string):Promise<any[]> {
  const fields = {
    _id:0,
    [fieldName]:1
  }

  let  ll=await Cust104Collection.find({},{fields}).fetch()
  ll =ll.filter((r)=>{
    // @ts-ignore
    const v=r[fieldName];
    return  !!v;
  });
  // @ts-ignore
  const mm=ListOP.listToMap(ll,r=>r[fieldName]);
  const allKeys=Object.keys(mm);
  return allKeys;
}

export const CollectionUtils = {
  getUniqueValue,
  enumField
}
