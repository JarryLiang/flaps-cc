import {IStoredDocument} from "/imports";
import {Button, Table} from "antd";
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

const Holder = styled.div`

`;

interface IProps {
  records: IStoredDocument[]
  openDoc:(doc:IStoredDocument)=>void;
}

function DocumentList(props: IProps) {
  const {records,openDoc} = props;
  const columns = [
    {
      title: '',
      dataIndex: '',
      key: 'open',
      width: 50,
      render: (record) => {
        return (<Button size={"small"} onClick={()=>{ openDoc(record);}}>Open</Button>)
      }
    },
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
      width: 50,
    },
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (value: string, record: IStoredDocument) => {
        const {url} = record;
        if (url) {
          return (<span><a href={url} target={"_blank"}>{value}</a></span>);
        } else {
          return (<span>{value}</span>);
        }
      }
    },
    {
      title: 'site',
      dataIndex: 'site',
      key: 'site',
      width: 100,
    },
  ];

  return (
    <Table
      bordered
      size={"small"}
      pagination={{position: 'both', pageSize: 5}}
      dataSource={records}
      columns={columns}
      rowKey={(r) => {
        return r._id;
      }}
    />
  );
}


export default DocumentList;
