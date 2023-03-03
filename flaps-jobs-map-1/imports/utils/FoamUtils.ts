

export interface ISegDefProps {
  range:{
    min?:number;
    max?:number;
  },
  label:string;
}


function converValueToSeg(value:number|undefined|null,segs:ISegDefProps[],naLabel:string):string {
  if((value==null)||(value==undefined)){
    return naLabel;
  }
  for (const {label, range} of segs) {
    const {min,max} = range;
    if(min==undefined){
      if(value<max!){
        return  label;
      }
    }
    if((value>=min!) && (value<max!)){
      return  label;
    }
    if(max==undefined){
      if(value>=min!){
        return  label;
      }
    }
  }
  return naLabel;
}

export const FoamUtils = {
  converValueToSeg
}


