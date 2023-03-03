import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {StringInputHook, SwitchInputHook} from "/imports/ui/input/inputs";
import WordDescWithQueryBlock from "/imports/ui/list/word-desc-with-query";
import {Button, Rate, Table} from "antd";
import {TableRowSelection} from "antd/lib/table/interface";
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {IWordFreq} from "/server/api/words-api";
import { Meteor } from "meteor/meteor";


interface IProps {
  records: IWordFreq[],
  onUpdate:(newList:IWordFreq[])=>void;
  noPager?:boolean;
}



function FreqWordList(props: IProps) {
  const {records,noPager,onUpdate} = props;
  const [localRecords,setLocalRecords ] = useState<IWordFreq[]>([]);
  const [selectedRowKeys,setSelectedRowKeys ] = useState([]);
  const [hiddenIgnore,setHiddenIgnore ] = useState(false);

  const [hideRated,setHideRated ] = useState(false);

  useEffect(()=>{
    let ll = [...records];
    if(hiddenIgnore){
       ll = ll.filter((r)=>!r.ignore);
    }

    if(hideRated){
      ll=ll.filter((r)=>{
        if(r.rate===undefined){
          return true;
        }
        return false;
      })
    }
    setLocalRecords(ll);
  },[records,hiddenIgnore,hideRated]);


  function onSelectChange(newSelection:string[]){
    console.log(newSelection);
    setSelectedRowKeys(newSelection)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };



  function doToggleIgnore(){
    const  ss ={};
    if(selectedRowKeys.length==0){
      return;
    }

    selectedRowKeys.forEach((r)=>{
      ss[r]=true;
    });


    const newList =records.map((r)=>{
      if(ss[r.voc]){
        return {
          ...r,
          ignore:true
        }
      }else {
        return r;
      }

    });

    Meteor.call("words.batchIgnore",selectedRowKeys,(err,res)=>{
      if(onUpdate){
        onUpdate(newList);
      }
      setSelectedRowKeys([]);
    });
  }


  function updateIgnore(v:boolean,record:IWordFreq){
    const {voc} = record;
    if(voc){
      const newList = records.map((r)=>{
        if(r.voc === record.voc){
          record.ignore = v;
          return {
            ...r,
            ignore:v
          }
        }else {
          return r;
        }
      });

      if(voc){
        record.ignore = v;
        Meteor.call("words.updateIgnore",voc,v,(err,res)=>{
          if(onUpdate) {
            onUpdate(newList);
          }
        });
      }
    }
  }

  function updateRate(record: IWordFreq, rate: number) {
    const {voc} = record;

    if(voc){
      const newList = records.map((r)=>{
        if(r.voc === record.voc){
          // @ts-ignore
          record.rate = rate;
          return {
            ...r,
            rate
          }
        }else {
          return r;
        }
      });

      Meteor.call("words.updateRating",voc,rate,(err,res)=>{
        if(onUpdate) {
          onUpdate(newList);
        }
      });
    }
  }


  function updateDesc(voc:string, desc: string) {
      const newList = records.map((r)=>{
        if(r.voc === voc){
          // @ts-ignore
          return {
            ...r,
            desc
          }
        }else {
          return r;
        }
      });

      Meteor.call("words.updateDesc",voc,desc,(err,res)=>{
        if(onUpdate) {
          onUpdate(newList);
        }
      });
  }

  const columns = [
    {
      title: 'Ignore',
      dataIndex: 'ignore',
      key: 'ignore',
      width: 10,
      render:(value,record)=>{
        const v=(!!value)?true:false;
        return(<SwitchInputHook checked={v} onChange={(nv)=>{
          updateIgnore(nv,record);
        }}/>);
      }

    },
    {
      title: 'voc',
      dataIndex: 'voc',
      key: 'voc',
      width: 40,
      render:(v:string)=>{
        const url=`https://dictionary.cambridge.org/dictionary/english-chinese-traditional/${v}`;
        return <span style={{fontSize:20}}>
          <a href={url} target={"_blank"}>
          {v}
          </a>
        </span>
      }
    },
    {
      title: 'rate',
      dataIndex: 'rate',
      key: 'rate',
      width: 230,
      render:(v:number,record:IWordFreq)=>{
        let padd =(v===undefined)?"X":v;
        return (
          <div>
          <AlignCenterRow>
            {padd}
            <Rate value={v} onChange={(v2)=>{
              updateRate(record,v2);
            }}  />
          </AlignCenterRow>
            <Button size={"small"} onClick={()=>{updateRate(record,0);}}>Zero</Button>
          </div>
          );
      }
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: (a:IWordFreq, b:IWordFreq) => {
        return a.order - b.order;
      }
    },
    {
      title: 'Desc',
      dataIndex: 'desc',
      key: 'desc',
      sorter: (a:IWordFreq, b:IWordFreq) => {

      },
      render:(value:string,record:IWordFreq)=>{
          return(
            <WordDescWithQueryBlock voc={record.voc}
                                    desc={value}
                                    onUpdateDesc={updateDesc} />
          );
      }
    },

  ];


  const pagination = noPager?false:
    {position:'top',defaultPageSize:10, showQuickJumper:"true",
      pageSizeOptions:[10,20,30,40,50,100]
    };
  return (
    <div>
      <AlignCenterRow>
        {localRecords.length}/{records.length}
      </AlignCenterRow>
      <AlignCenterRow>
        <Button onClick={doToggleIgnore}>Taggle Ignore Selected</Button>
        <SwitchInputHook checked={hiddenIgnore} onChange={setHiddenIgnore} />
        <span>Hide Ignore</span>
        <span>{'  '}</span>
        <SwitchInputHook checked={hideRated} onChange={setHideRated} />
        <span>Hide Rated</span>
      </AlignCenterRow>
    <Table
      bordered
      size={"small"}
      rowSelection={rowSelection}
      pagination={pagination}
      dataSource={localRecords}
      columns={columns}
      rowKey={(r) => {
        return r._id;
      }}
    />
    </div>
  );
}


export default FreqWordList;
