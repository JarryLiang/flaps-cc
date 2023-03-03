import {MultiBlockOnOff} from "/imports/components/multi-tag-on-off/MultiBlockOnOff";
import {SpinText} from "/imports/components/SpinText/SpinText";
import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {StringInputHook} from "/imports/ui/input/inputs";
import WordDescWithQueryBlock from "/imports/ui/list/word-desc-with-query";
import {StringUtils} from "/imports/utils/string";
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import OmHelper from 'client/OmHelper';
import classNames from 'classnames';

import {
  Button, message, JsonTabSwitchView, Icon, showErr, tryCall, showMsg,
} from 'components/ui-elements';
import {Meteor} from 'meteor/meteor';


const Holder = styled.div`

`;


const IndustryBlockHolder = styled.div`
  display: inline-block;
  padding: 4px;

  .title {
    font-size: 14px;
    padding-bottom: 4px;
  }

  .desc {
    font-size: 12px;
  }
`;


function IndustryBlock({item}) {
  const {coIndustryDesc, company, jobs} = item;
  const desc = `C:${company}  /  J:${jobs}`;
  return (<IndustryBlockHolder>
    <div className={"title"}>{coIndustryDesc}</div>
    <div className={"desc"}>{desc}</div>
  </IndustryBlockHolder>);
}

interface IProps {
  onUpdate: (filter: string[]) => void;
}

function IndustryFilterBlock(props: IProps) {
  const {onUpdate} = props;
  const [items, setItems] = useState(null);
  const [selected, setSelected] = useState([]);

  const [remainItems, setRemainItems] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading,setLoading ] = useState(false);


  useEffect(()=>{
      const ll = items||[];
      if(StringUtils.isBlank(filterText)){
        setRemainItems([...ll]);
      }else{
        const mm=ll.filter((r)=>{
          return r.coIndustryDesc.indexOf(filterText)>=0;
        });
        setRemainItems(mm);
      }
    },[filterText,items]);
  function onSelectBlock(values) {
    setSelected(values);
    const ll = values.map((r) => {
      return r.coIndustryDesc;
    });
    onUpdate(ll);
  }

  useEffect(() => {
    setLoading(true);
    Meteor.call("jobs.getIndustryStatistic", (err, res) => {
      setLoading(false);
      if (res) {
        const ll = JSON.parse(res);
        ll.sort((a, b) => {
          return b.company - a.company;
        })
        setItems(ll);
      }

    });
  }, []);

  function renderItem(item) {
    return (<IndustryBlock item={item} key={item.coIndustryDesc}/>);
  }

  function renderSelector() {
    if (!items) {
      return null;
    }
    return (<MultiBlockOnOff items={remainItems}
                             values={selected}
                             nullable={true}
                             onUpdate={onSelectBlock} itemRender={renderItem}/>);
  }

  function renderFilter() {
    return <AlignCenterRow>
      <span style={{paddingLeft:4}}>Filter Text:</span>
      <StringInputHook value={filterText} onUpdate={setFilterText}/>
      <span/>
      {loading &&(<SpinText title={"載入產業"} />)}
    </AlignCenterRow>
  }

  return <div style={{padding:10}}>
    {renderFilter()}
    {renderSelector()}
  </div>
}


export function IndustryFilterBlock_ForStory(props: IProps) {
  return (<IndustryFilterBlock {...props} />);
}

export default IndustryFilterBlock;
