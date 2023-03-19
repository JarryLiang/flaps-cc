
import {MenuBar} from "/imports/ui/Menubar";
import {StringHelper} from "@alibobo99/js-helper";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import parseUrl from "parse-url";

const Holder = styled.div`

`;

interface IProps {

}

const defaultQuery = {
  "ro": "0",
  "isnew": "30",
  "kwop": "7",
  "keyword": "專櫃",
  "expansionType": "area,spec,com,job,wf,wktm",
  "area": "6001001001",
  "order": "16",
  "asc": "0",
  "page": "1",
  "mode": "s",
  "jobsource": "2018indexpoc",
  "langFlag": "0",
  "langStatus": "0",
  "recommendJob": "1",
  "hotJob": "1"
}
const ROOTURL = "https://www.104.com.tw/jobs/search/";

function MiscTestPage(props:IProps) {
  const { } = props;

  const [data,setData ] = useState({});
  const [resultUrl,setResultUrl ] = useState();

  function buildQuery(userQuery){
    //store query parameters in a temporary variable
    var query = [];
    //loop through user query object
    for (var key in userQuery) {
      //encode the keys and values this is most necessary for search inputs
      query.push(encodeURIComponent(key) + '=' + encodeURIComponent(userQuery[key]));
    }
    //construct new URL
    let new_url = ROOTURL+ (query.length ? '?' + query.join('&') : '');
    return(new_url);
  }

  function genUrl(qq){
    return buildQuery(qq);
  }

  useEffect(()=>{
    const url = "https://www.104.com.tw/jobs/search/?ro=0&jobcat=2001001000%2C2001002000&isnew=30&keyword=%E9%96%80%E5%B8%82&expansionType=area%2Cspec%2Ccom%2Cjob%2Cwf%2Cwktm&area=6001002002&order=16&asc=0&page=1&mode=s&jobsource=2018indexpoc&langFlag=0&langStatus=0&recommendJob=1&hotJob=1";
    const p =parseUrl(url);
    setData(p);
    const ss= genUrl({...defaultQuery,keyword:"門市"});
    setResultUrl(ss);
  },[]);





  return (
    <Holder>
      <MenuBar />
      {resultUrl}
      <pre>
        {JSON.stringify(data,null,2)}
      </pre>


    </Holder>
  );
}




export default MiscTestPage;
