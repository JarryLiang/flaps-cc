import {initExtApp} from "./init/AppInit";



function doExtensionInit104() {


  function waitForSelector(sel,time){
    let start = new Date().getTime();

    return new Promise((resolve, reject) => {
      let lCount = 0;
      const handler =setInterval(()=>{
        lCount++;
        console.log(`retry count: :${lCount}`);
        const el =document.querySelector(sel);
        if(el){
          clearInterval(handler);
          resolve(el);
        }else {
          let now = new Date().getTime();
          if ((now-start) > time){
            clearInterval(handler);
            resolve(null);
          }
        }
      },300);
    });
  }
  async function injectAncher(parent,ancherId){
    const box = document.createElement("div");
    box.id = ancherId;
    box.style.position = 'relative';
    box.style.zIndex = 99999;
    parent.appendChild(box);
    const boxEle =await waitForSelector(`#${ancherId}`,10000);
    if(boxEle){
      console.log("injected");
    }
    return boxEle;
  }

  async function waitForInject() {

    const ele = await waitForSelector("body",10000);
    if(!ele){
      return;
    }

    const _RootDivID = "react-root";
    const su = await injectAncher(ele,_RootDivID);

    if(su){
      initExtApp(`#${_RootDivID}`);
    }




  }


  /*****************************************
   *
   *
   * ****************************************/
  async function  asyncInit(){
    await waitForInject();



  }


  asyncInit().then(()=>{
    console.log("inited");
  });
  //wait for something.

}

setTimeout(()=>{
  doExtensionInit104();
},2000)

