import {Button} from "antd";
import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import AlignCenterRow from "../component/AlignCenterRow";
import {PageUtils} from "../utils/PageUtils";
import 'antd/dist/antd.css';

const Holder = styled.div`
  position: fixed;
  left: 0px;
  bottom: 0px;
  background-color: #EEE;
  color: #000;
  padding: 20px;
  border: solid 1px #CCC;
  border-radius: 8px;
  margin: 10px;
  button {
    border: solid 1px #000;
  }
  .touch-end {
    background-color: red;
  }
  .in-processing{
    background-color: slateblue;
  }
`;

interface IProps {

}

function MainControl(props: IProps) {
  const {} = props;

  const [onScrolling,setOnScrolling ] = useState(false);
  const startScrollDownRef = useRef(false);
  const scrollHeightRef = useRef();
  const [lastHeight,setLastHeight ] = useState();
  const [tick,setTick ] = useState(new Date().getTime());
  const [inClickMore,setInClickMore ] = useState(false);
  const inClickMoreRef = useRef(false);

  const lastNextText = useRef();
  const [touchEnd,setTouchEnd ] = useState(false);

  useEffect(() => {
    scrollHeightRef.current = PageUtils.getScrollHeight();
    setLastHeight(scrollHeightRef.current);
  }, []);


  function getMoreBtn(){
    const ll=document.querySelectorAll("button.js-more-page");
    const sz = ll.length;
    const list = [];
    for(let i=0;i<sz;i++){
      list.push(ll[i]);
    }
    if(list.length==0){
      return null;
    }
    return list[sz-1];
  }

  function checkScrollToEnd() {
    const h = PageUtils.getScrollHeight();
    if (h == scrollHeightRef.current) {
      setOnScrolling(false);
      startScrollDownRef.current = false;
      /*
      * scroll 只要check是否到尾 不需要檢查多個 more  button 的狀況
      * */
      if(!getMoreBtn()){
        setTouchEnd(true);
      }else {
        //start =>
        handleStartClickMore();
      }
    }
  }

  function doScrollDown() {
    setTick(new Date().getTime());
    if (startScrollDownRef.current) {
      scrollHeightRef.current = PageUtils.getScrollHeight();
      PageUtils.scrollToBottom();
      setTimeout(() => {
        checkScrollToEnd();
        doScrollDown();
      }, 5000);
    }
  }

  function handlePressStartScrollDown() {
    setOnScrolling(true);
    startScrollDownRef.current=true;
    setTimeout(() => {
      doScrollDown();
    }, 3000);
  }
  function handlePressStopScrollDown(){
    setOnScrolling(false);
    startScrollDownRef.current=false;
  }

  function tryIfHasLoadMore(){
    const btn = getMoreBtn();
    if(btn){
      doLoopClickMore();
    }else {
      setTouchEnd(true);
      setInClickMore(false);
      inClickMoreRef.current=false;
    }
  }
  function checkMoreBtnIsUsed(btn){
    const text = btn.innerText;
    if(text === lastNextText.current){
      return true;
    }
    return false;
  }
  function doLoopClickMore(){

    if(inClickMoreRef.current){
      const btn = getMoreBtn();
      if(btn){
        // @ts-ignore
        if(checkMoreBtnIsUsed(btn)){
          handleStopClickMore();
          setTouchEnd(true);
        }else {
          lastNextText.current=btn.innerText;
          btn.click();
          PageUtils.scrollToBottom();
          setTimeout(()=>{
            tryIfHasLoadMore();
          },2000);
        }
      }else {

      }


    }
  }

  function handleStopClickMore(){
    setInClickMore(false);
    inClickMoreRef.current=false;
  }
  function handleStartClickMore(){
    lastNextText.current = null;
    setInClickMore(true);
    inClickMoreRef.current=true;
    doLoopClickMore();
  }
  function renderScrollDownButton() {
    if (!onScrolling) {
      if(getMoreBtn()){
        if(inClickMore){
          return (<Button onClick={handleStopClickMore}>停止持續點ClickMore</Button>);
        }else {
          return (<Button onClick={handleStartClickMore}>持續點ClickMore</Button>);
        }
      }else {
        return (<Button onClick={handlePressStartScrollDown}>持續滾到底</Button>);
      }
    }
    return (<Button onClick={handlePressStopScrollDown}>停止滾動</Button>);
  }

  function getWindowsHeight(){
    return PageUtils.getScrollHeight();
  }
  function renderStatus(){
    if(touchEnd){
      return <span className={"touch-end"}>已經到底</span>
    }
    if(onScrolling){
      return <span className={"in-processing"}>滾動中</span>
    }
    if(inClickMore){
      return <span className={"in-processing"}>點取下一步中:{lastNextText.current}</span>
    }


  }
  return (
    <Holder>
      <AlignCenterRow>
        {renderScrollDownButton()}
        {getWindowsHeight()}/{scrollHeightRef.current}:{tick}
      </AlignCenterRow>
      <AlignCenterRow>
        {renderStatus()}
      </AlignCenterRow>
    </Holder>
  );
}


export function MainControl_ForStory(props: IProps) {
  return (<MainControl {...props} />);
}

export default MainControl;
