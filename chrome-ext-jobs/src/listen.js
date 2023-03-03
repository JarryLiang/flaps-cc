import {isBlank} from "./lib/string-helper";
import {saveStringToFile} from "./lib/IO";



let hasAppend = false;


function processAttachedData(text,fn) {

  const ts=Math.floor(Date.now()/1000);
  const fileName=`claw-104-${fn}-${ts}.json`;
  saveStringToFile(text,fileName);
}


function saveStringToFile_G(srcContent, fileName) {
  if (!srcContent) {
    return;
  }
  let content = srcContent;

  if (typeof (content) !== 'string') {
    content = JSON.stringify(srcContent, null, 2);
  }

  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.id = fileName;

  const blob = new Blob([content], {type: 'application/json'});
  const url = window.URL.createObjectURL(blob);

  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}


function scrapeData() {
  var responseContainingEle = document.getElementById('__intercepted-coin-list');
  if(responseContainingEle){
    var fn =responseContainingEle.getAttribute("fn");
    const text=responseContainingEle.innerHTML;
    if(isBlank(text)===false){
      try{
        console.log("Prepare to download");
        processAttachedData(text,fn);
        console.log(`send to back ${text.length}`);
      }catch (e) {
        console.error(e)
      }
      responseContainingEle.remove();

    }else {
      //tested
    }
  }
  requestIdleCallback(scrapeData);
}




const scriptToInject=`
(function () {
  var fakeData = {
    "data": {
      "totalCount": 0,
      "totalPages": 1,
      "page": 1,
      "pageSize": 20,
      "list": {
        "topJobs": [],
        "normalJobs": []
      }
    },
    metadata: []
  };
  function saveStringToFile(srcContent, fileName) {
    if (!srcContent) {
      return;
    }
    var content = srcContent;
    if (typeof content !== 'string') {
      content = JSON.stringify(srcContent, null, 2);
    }
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.id = fileName;
    var blob = new Blob([content], {
      type: 'application/json'
    });
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  function saveStringToFileDelay(data, fileName) {
    setTimeout(() => {
      saveStringToFile(data, fileName);
    }, 100);
  }
  var XHR = XMLHttpRequest.prototype;
  var send = XHR.send;
  var open = XHR.open;
  function doFakeRequest(newUrl) {
    var req = new XMLHttpRequest();
    req.open('get', newUrl);
    req.send();
  }
  XHR.open = function (method, url) {
    this.url = url; // the request url
    // if(this.url.includes("company/ajax/")) {
    //   //-->another ??
    //   if(!url.includes("options")){
    //     if(url.includes("joblist")){
    //       const newUrl = url.replace("joblist","content");
    //       console.log("target");
    //       console.log(newUrl);
    //       setTimeout(()=>{
    //         doFakeRequest(newUrl);
    //       },100);
    //     }
    //   }
    // }
    return open.apply(this, arguments);
  };
  function getTarget(url, fakeUrl) {
    debugger;
    if (url.indexOf("company/ajax/joblist") >= 0) {
      return "comp_job";
    }
    if (url.indexOf("company/ajax/content/") >= 0) {
      return "company_content";
    }
    if (url.indexOf("jobs/search/list") >= 0) {
      return "search_jobs";
    }
    if (fakeUrl) {
      if (fakeUrl.includes('company/ajax/content/')) {
        return "company-content";
      }
    }
    return undefined;
  }
  XHR.send = function () {
    if (this) {
      this.addEventListener('load', function () {
        console.log(this.url);
        var target = getTarget(this.responseURL, this.fakeUrl);
        debugger;
        // const isJobList = this.url.includes('list?');
        // let isCompanyContent = this.url.includes('company/ajax/content/');
        //
        // if(this.fakeUrl){
        //   isCompanyContent = this.fakeUrl.includes('company/ajax/content/');
        // }
        if (target) {
          //debugger
          //-->
          var subName = target;
          try {
            var data = {
              url: this.url,
              time: Date.now(),
              type: target,
              result: this.response
            };
            this.response = fakeData;
            var fn = "clawer104-".concat(subName, "-").concat(Date.now(), ".json");
            saveStringToFileDelay(data, fn);
          } catch (e) {
            debugger;
            console.error(e);
            saveStringToFileDelay(this.response, "errordata.json");
          }
        }
      });
    }
    try {
      return send.apply(this, arguments);
    } catch (e) {}
  };
})();
`;

function activeFetch(){
  if(window.location.host==='www.104.com.tw'){
    if(window.location.pathname.includes("/company/")){
      const ss=window.location.pathname.split("/");
      const briefPath=ss[ss.length-1];
      const targetUrl=`https://www.104.com.tw/company/ajax/content/${briefPath}?`;
      var req = new XMLHttpRequest();
      req.onload = (e)=>{
        const text=e.currentTarget.responseText;
        const subName='company';
        try {
          var data = {
            time: Date.now(),
            type: subName,
            result: JSON.parse(text)
          };
          var fn = "clawer104-".concat(subName, "-").concat(Date.now(), ".json");
          saveStringToFile_G(data, fn);
        } catch (e) {
          console.error(e);
        }
      }
      req.open('get', targetUrl);
      req.send();
    }
  }
}

function interceptData() {
  console.log("Inject");
  var xhrOverrideScript = document.createElement('script');
  xhrOverrideScript.type = 'text/javascript';
  xhrOverrideScript.innerHTML = scriptToInject;
  xhrOverrideScript.id="alibobo";
  document.head.prepend(xhrOverrideScript);
  hasAppend = true;

  setTimeout(()=>{
    activeFetch();
  },300);
}

function checkForDOM() {
  if (document.body && document.head) {
    if(!hasAppend){
      interceptData();
    }
  } else {
    requestIdleCallback(checkForDOM);
  }
}

requestIdleCallback(checkForDOM);

