import React,{useEffect} from 'react';
import styled from 'styled-components';
import {MenuBar} from "/imports/ui/Menubar";
const Holder = styled.div`

`;

interface IProps {

}

function Home(props:IProps) {
  const { } = props;

  useEffect(()=>{

  },[]);


  return (
    <Holder>
      <MenuBar />
      Home
    </Holder>
  );
}


export function Home_ForStory(props:IProps){
 return (<Home {...props} />);
}

export default Home;
