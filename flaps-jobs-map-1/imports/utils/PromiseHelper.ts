/*
* concate: default = false , not tested
* collection is a array
* genPromise: receive part of collection to generate promised.
* onBatchCompleted: when current batch completed.
*
* */
import {showErr, showMsg} from "/imports/ui/common/antd-wrap";


function batchPromise({
                        batchSize, collection, genPromise, onBatchCompleted, concate,
                      }) {
  /*
  * .map((_, i) => (i % batchSize ? [] : arr.slice(i, i + batchSize)))
  * 這段會變成 每batchSize 會有第一個是有資料 後面是空的
  * 所以會有 if(results.length>0) 這段
  * */
  return Promise.resolve(collection).then(arr => arr
    .map((_, i) => (i % batchSize ? [] : arr.slice(i, i + batchSize)))
    .map(group => res => Promise.allSettled(group.map(genPromise)).then((results) => {
      if (results.length > 0) {
        onBatchCompleted(results);
        if (concate) {
          return res.concat(results);
        }
      }
      return res;
    }))
    .reduce((chain, work) => chain.then(work), Promise.resolve([])));
}


function divideListBySize(list, eachSize) {
  const sz = list.length;

  const result = [];
  for (let i = 0; i < sz; i += eachSize) {
    const seg = list.slice(i, i + eachSize);
    if (seg.length > 0) {
      result.push(seg);
    }
  }
  return result;
}


interface ISimplePSProps {
  onOK?:()=>void;
  onError?:(error:any)=>void;
  onFinally?:()=>void;
  showComplete?:boolean;
}

function simpleProcess(ps,options?:ISimplePSProps) {
  ps.then(() => {
    if(options && options.showComplete){
      showMsg("Operation Completed");
    }
    if(options && options.onOK){
        options.onOK();
    }
  }).catch((err) => {
    showErr(err);
    console.error(err);
    if(options && options.onError){
      options.onError(err);
    }
  }).finally(()=>{
    if(options && options.onFinally){
      options.onFinally();
    }
  })
}

export const PromiseHelper = {
  batchPromise,
  divideListBySize,
  simpleProcess
};
