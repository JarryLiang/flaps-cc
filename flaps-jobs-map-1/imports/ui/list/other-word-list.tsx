import {IToken} from "/imports";
import AddVocabularyBlock from "/imports/ui/add-vocabulary-block/AddVocabularyBlock";
import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {Table} from "antd";

import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

import {Button} from "antd";

import {
  PlusCircleOutlined
} from '@ant-design/icons';

const Holder = styled.div`

`;

interface IProps {
  records: IToken[],
}



function OtherWordList(props: IProps) {
  const {records} = props;

  const [targetVoc,setTargetVoc ] = useState("");

  function doAdd(voc:string){
      setTargetVoc(voc);
  }

  const columns = [
    {
      title: 'Text',
      dataIndex: 'text',
      key: 'text',
      width: 100,
      render: (value, record) => {
        const url = `https://dictionary.cambridge.org/dictionary/english-chinese-traditional/${value}`;
        return (<AlignCenterRow>
          <span>
          <a href={url} target={"_blank"}>
            {value}
          </a>
          </span>

          <span onClick={()=>{ doAdd(value); }} style={{cursor:"pointer"}}>
            <PlusCircleOutlined />
          </span>
        </AlignCenterRow>);
      };
    },
    {
      title: 'Cap',
      dataIndex: 'isCaptital',
      key: 'isCaptital',
      width: 100,
      sorter: (a, b) => {
        const av = a.isCaptital ? 1 : 0;
        const bv = b.isCaptital ? 1 : 0;
        return av - bv;
      },
      render: (v: boolean) => {
        if (v) {
          return "C"
        }
        return "";
      }
    },
  ];


  return (
    <Holder>
      <AlignCenterRow>
        <span>{records.length}</span>
      </AlignCenterRow>
      <AddVocabularyBlock text={targetVoc}/>
      <Table
        bordered
        pagination={false}
        dataSource={records}
        columns={columns}
        rowKey={(r) => {
          return r.text;
        }}
      />
    </Holder>
  );
}


export default OtherWordList;
