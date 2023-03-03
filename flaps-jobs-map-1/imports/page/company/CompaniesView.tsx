import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import JsonPre from "/imports/ui/common/JsonPre";
import {StringInputHook, SwitchInputHook} from "/imports/ui/input/inputs";
import {MenuBar} from "/imports/ui/Menubar";
import {DigestUtils} from "/imports/utils/Digest";
import {PromiseHelper} from "/imports/utils/PromiseHelper";
import {StringUtils} from "/imports/utils/string";
import {ICustBase} from "/server/data-104/datatype";
import {Button, Table, Tag, Tooltip} from "antd";
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {Meteor} from "meteor/meteor";

import type { TableRowSelection } from 'antd/es/table/interface';


const Holder = styled.div`
  .clickable {
    cursor: pointer;
    display: inline-block;
  }
  .icon-holder {
    width: 64px;
  }
  .cust-icon {
    width: 60px;
  }
`;

interface IProps {

}

function getCustUrl(record:ICustBase) {
  const {custKey} = record;
  const url =`https://www.104.com.tw/company/${custKey}?jobsource=jolist_a_relevance`;
  return url;
}

function CompaniesView(props: IProps) {
  const {} = props;

  const [companies, setCompanies] = useState<ICustBase[]>([]);
  const [remains, setRemains] = useState<ICustBase[]>([]);
  const [filterText, setFilterText] = useState("");
  const [timestamp,setTimestamp ] = useState(0);
  const [selectedCustNos,setSelectedCustNos ] = useState([]);
  const [ignoreMap,setIgnoreMap ] = useState({});

  const rowSelection: TableRowSelection<ICustBase> = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedCustNos(selectedRowKeys);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  function pressToggleIgnore(){
    if(selectedCustNos.length>0){
      selectedCustNos.forEach((custNo)=>{
        updateIgnore(custNo,true);
      });
    }
  }


  useEffect(() => {

    if(StringUtils.isBlank(filterText)){
      setRemains([...companies]);
    }else {
      const ll=companies.filter((r)=>{
        const {custName,profile,product} =r;

        if(custName.indexOf(filterText)>=0){
          return true;
        }
        if(profile){
          if(profile.toLowerCase().indexOf(filterText)>=0){
            return true;
          }
        }
        if(product){
          if(product.toLowerCase().indexOf(filterText)>=0){
            return true;
          }
        }


        return false;
      });
      setRemains(ll);
    }

  }, [companies, filterText]);

  async function loadCompanyIgnore(){

    Meteor.call("company.loadIgnore", (err, res) => {

      const ig = JSON.parse(res);
      setIgnoreMap(ig);
    })
  }

  async function loadCompanies() {
    Meteor.call("company.list", (err, res) => {
      const ll = JSON.parse(res);
      setCompanies(ll);
    })
  }

  useEffect(() => {
    PromiseHelper.simpleProcess(loadCompanyIgnore());
    PromiseHelper.simpleProcess(loadCompanies());



  }, []);


  function triggerRender() {
    setTimestamp(timestamp+1);
  }

  function updateIgnore(custNo: any, v: boolean) {
    // @ts-ignore
    ignoreMap[custNo]=v;
    setIgnoreMap(ignoreMap);
    Meteor.call("company.updateIgnore",custNo,v,(err,res)=>{

    });
    triggerRender();
  }

  const columns = [
    {
      title: 'id',
      dataIndex: '_id',
      key: 'id',
      width: 10,
      render:(value)=>{
        return(
          <Tooltip title={value}>
            <Tag>id</Tag>
          </Tooltip>
        );
      }
    },
    {
      title: 'ignore',
      key: 'ignore',
      width: 50,
      render:(record)=>{
        const {custNo} = record;
        // @ts-ignore
        const v=ignoreMap[custNo];
        return (<SwitchInputHook checked={v} onChange={(v)=>{
          updateIgnore(custNo,v);
        }} />);
      }
    },
    {
      title: 'Name',
      dataIndex: 'custName',
      key: 'custName',
      width: 140,
      render:(value,record)=>{
        const {custKey} = record;
        const {logo} = record;
        const logoImg = logo?<img className={"cust-icon"} src={logo}/>:null;
        const url = getCustUrl(record);
        return(
          <AlignCenterRow>
            <div className={"icon-holder"}>
              {logoImg}
            </div>
            <div className={"clickable"} onClick={()=>{
              window.open(url,"_blank");
            }}>
              {value}
            </div>

          </AlignCenterRow>
          );

      }
    },
    {
      title: '產業',
      dataIndex: 'indcat',
      key: 'indcat',
      width: 100,
    },
    {
      title: 'Jobs',
      dataIndex: 'jobCount',
      key: 'jobCount',
      width: 50,
      align:"right",
      sorter:(a,b)=>{
       return a.jobCount-b.jobCount;
      }
    },
    {
      title: 'empNo',
      dataIndex: 'empNo',
      key: 'empNo',
      align:"right",
      width: 50,
    },
    {
      title: '資本',
      dataIndex: 'capital',
      key: 'capital',
      align:"right",
      width: 100,
    },
    {
      title: 'addrNoDesc',
      dataIndex: 'addrNoDesc',
      key: 'addrNoDesc',
      width: 100,
    },



  ];

  function renderTable() {
    return (
      <Table
        bordered
        size={"small"}
        pagination={{position: 'both'}}
        dataSource={remains}
        columns={columns}
        rowSelection={{ ...rowSelection, checkStrictly:false }}
        rowKey={(r) => {
          return r.custNo;
        }}
      />
    );

  }


  return (
    <Holder>
      <MenuBar/>
      <AlignCenterRow>
        Filter:
        <StringInputHook value={filterText} onUpdate={setFilterText} />
        <span/>
        Count:
        {remains.length}
        <Button onClick={pressToggleIgnore}>Set selected to ignore</Button>
      </AlignCenterRow>
      {renderTable()}
    </Holder>
  );
}


export function CompaniesView_ForStory(props: IProps) {
  return (<CompaniesView {...props} />);
}

export default CompaniesView;
