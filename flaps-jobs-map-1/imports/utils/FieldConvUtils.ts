import {Dictionary} from "/index";
import {StringHelper} from "@alibobo99/js-helper";

type result = string|number|undefined;

function parseEmpNo(str: string):result {
  if (StringHelper.isBlank(str)) {
    return undefined
  }
  const p1 = /(\d+)人/;

  const m1=str.match(p1);
  if(m1){
    if(m1.length>1){
      return parseInt(m1[1]);
    }
  }
  return undefined;
}

function parseCap(str:string):result {
  // if (StringUtils.isBlank(str)) {
  //   return undefined
  // }

  const p1 = /(\d+)億/;
  const p2 = /(\d+)萬/;


  let hasValue = false;
  let value = 0;

  const m1=str.match(p1);
  if(m1){
    if(m1.length>1){
      hasValue=true;
      value+=parseInt(m1[1])*10000;

    }
  }
  const m2=str.match(p2);
  if(m2){
    if(m2.length>1){
      hasValue=true;
      value+=parseInt(m2[1]);

    }
  }
  if(hasValue){
    return value;
  }
  return undefined;
}
function removeNull(r: any) {
  const result:Dictionary<any> = {};
  Object.keys(r).forEach((k)=>{
    const v= r[k];
    if((v==null)||(v==undefined)){

    }else{
      // @ts-ignore
      result[k]=v;
    }
  });
  return result;
}
export const FieldConvUtils = {
  parseEmpNo,
  parseCap,
  removeNull
}
