import {StringUtils} from "/imports/utils/string";

import {getByPath} from "/imports/utils/obj-helper";


export interface ITreeMapLevelNode {
  id: string;
  label: string;
  type:string;
  weight?: number;
  realWeight?: number;
  value?: any;
  groups?:any[];
  [key:string]:any;
}


export interface ITreeMapRecordPreFilter {
    label:string;
    value:string;
    processor:(records:any[])=>any[];
}





export interface ITreeMapFinalLevelProcessor {
  (record: any) :ITreeMapLevelNode
}

export interface ITreeMapLevelProcessor {
  (path: string[], record: any, levelType:string): Partial<ITreeMapLevelNode>[];
}

function normalLevelProcessor(path: string[], record: any,levelType:string): Partial<ITreeMapLevelNode>[] {
  const value = getByPath(path, record, undefined);
  if (!value) {
    const node: Partial<ITreeMapLevelNode> = {
      id: `${levelType}-'N/A'`,
      label: 'N/A',
      levelType,
    }
    return [node];
  }
  if (Array.isArray(value)) {
    const nodes: Partial<ITreeMapLevelNode>[] = value.map((v) => {
      const node: Partial<ITreeMapLevelNode> = {
        id: `levelType-${v}`,
        label: v,
        levelType,
      }
      return node;
    });
    return nodes;
  }

  const node: Partial<ITreeMapLevelNode> = {
    id:  `levelType-${value}`,
    label: value,
    levelType,
  };
  return [node];
}

export interface ITagItem {
  label:string;
  value:string;
}


export interface ITreeMapLevelConfig {
  path:string[];
  fieldProcessor:ITreeMapLevelProcessor;
  levelType:string;
}

export interface ITreeMapConfig {
  finalLevels:ITagItem[];
  levels:ITagItem[];
  defaultLevels:ITagItem[];
  finalLevelProcessors:{
    [key:string]:ITreeMapFinalLevelProcessor
  };
  levelProcessors:{
    [key:string]:ITreeMapLevelProcessor
  };
  levelPath:{
    [key:string]:string[]
  },
  recordPreFilters:ITreeMapRecordPreFilter[]
}

export interface ISuggestLayout {
  title: string;
  desc: string;
  suggestLevels: ITagItem[];
  finalLevel: ITagItem;
}

export interface INumberSegDef {
  min:number;
  max:number;
  label:string;
};

export function genNumberSegLabel(value:any,segDef:INumberSegDef[],defaultLabel:string):string{
  if(StringUtils.isEmpty(value)){
    return defaultLabel;
  }
  let result:string =defaultLabel;
  segDef.forEach((seg)=>{
    if((value>=seg.min) && (value<seg.max)){
      result=seg.label;
    }
  })
  return result;
}



export const TreeMapDefs = {
  normalLevelProcessor,
}
