import React from "react";
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';



import MainControl from "../main-control/MainControl";


const Holder = styled.div`
  position: relative;    
`;


interface IProps {
  // @ts-ignore
  children: JSX.Element,
}

function AppHolder(props:IProps) {
  const { children } = props;
  return (
    <Holder>
      {children}
    </Holder>
  );
}


export function initExtApp(sel:string){

  const container = document.querySelector(sel);
  if(!container){
    alert("Invalid container");
    return;
  }
  const root = createRoot(container);
  // @ts-ignore
  root.render(<AppHolder> <MainControl /> </AppHolder>);
}

