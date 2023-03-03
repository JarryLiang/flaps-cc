import React,{useState,useEffect} from 'react';
import styled from 'styled-components';



import {ISuggestLayout} from "../foam-treemap-def";
import {MultiBlockOnOff} from "../multi-tag-on-off/MultiBlockOnOff";
import {CommonDialogActions} from "../CommonDialogActions";
import {HeaderBar} from "../styled";


const Holder = styled.div`

`;


interface IProps {
  onCancel:()=>void;
  // @ts-ignore
  onOK:(result:any)=>void;
  suggestLayouts:ISuggestLayout[];
}

const HolderStyle={
  flexDirection:"column",
  width:"100%"
}

const SuggestLayoutViewHolder=styled.div`
  >.title {
    color: #0000CC;
    font-size: 14px; 
  }
  >.desc {
    font-size: 12px;
    color: #0C0C0C;
    font-weight: bold;
  }
  >.sumup {
    font-size: 12px;
    color: #0C0C0C;
    >.item {
      color: #0000CC;
      font-weight: bold;
    }
  }
  
  
`;
// @ts-ignore
function SuggestLayoutView({layoutConfig}){
  const { title,desc,suggestLevels,finalLevel} = layoutConfig;

  // suggestLevels: ITagItem[];
  // finalLevel: ITagItem;
  return(<SuggestLayoutViewHolder>
    <div className={"title"}>{title}</div>
    <div className={"desc"}>{desc}</div>
    <div className={"sumup"}>Sum by: <span className={"item"}>{finalLevel.label}</span></div>
  </SuggestLayoutViewHolder>);
}

function SuggestLevelsPicker(props:IProps) {
  const { suggestLayouts ,onCancel ,onOK} = props;
  const [selectedLayout,setSelectedLayout ] = useState<ISuggestLayout>();

  function renderItem(layoutConfig:ISuggestLayout){
    return (<SuggestLayoutView layoutConfig={layoutConfig} />);
  }
  function handlePressOK(){
    // @ts-ignore
    const {suggestLevels,finalLevel} =selectedLayout;
    if(onOK){

      onOK({levels:suggestLevels,finalLevel:finalLevel.value});
    }else{
      console.log(selectedLayout);
    }

  }
  return (
    <Holder>
      <HeaderBar title={"Select Predefined levels"}>
        <CommonDialogActions okValid={!!selectedLayout} onCancel={onCancel} onOK={handlePressOK} />
      </HeaderBar>
      <MultiBlockOnOff items={suggestLayouts} itemRender={renderItem} single value={selectedLayout} onUpdate={setSelectedLayout}
                       style={HolderStyle} />
    </Holder>
  );
}


export default SuggestLevelsPicker;
