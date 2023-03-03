import React,{useState,useEffect} from 'react';
import styled from 'styled-components';


const Holder = styled.div`

`;

interface IProps {

}

function JobsView(props:IProps) {
  const { } = props;

  useEffect(()=>{

  },[]);


  return (
    <Holder>
      JobsView
    </Holder>
  );
}


export function JobsView_ForStory(props:IProps){
 return (<JobsView {...props} />);
}

export default JobsView;
