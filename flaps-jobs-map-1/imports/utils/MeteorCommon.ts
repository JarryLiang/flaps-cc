import {Meteor} from "meteor/meteor";


async function simpleCall(methodName:string,param?:any){
    return new Promise((resolve, reject) => {
      if(param){
        Meteor.call( methodName,param, (err:any, res:any) => {
          if(err){
            reject(err);
          }else {
            resolve(res);
          }
        });
      }else {
        Meteor.call( methodName, (err:any, res:any) => {
          if(err){
            reject(err);
          }else {
            resolve(res);
          }
        });
      }

    });

}

export const MeteorCommon = {
  simpleCall
}
