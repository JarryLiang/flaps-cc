import {ILine, ISourceDoc} from "/imports";
import ProcessedArticlePage from "/imports/page/ProcessedArticlePage";
import FreqWordList from "/imports/ui/list/freq-word-list";
import OtherWordList from "/imports/ui/list/other-word-list";
import {Tabs} from "antd";
import React, {useState} from 'react';


const {TabPane} = Tabs;



interface IProps {
  wordGroup: any;
  sourceDoc: ISourceDoc;
}

function WordGroupNav(props: IProps) {
  const [wordGroup, setWordGroup] = useState(props.wordGroup);


  // @ts-ignore
  function updateNotCapList(list) {
    const newGroup = {
      ...(wordGroup || {}),
      notCapList: list
    }
    // @ts-ignore
    setWordGroup(newGroup);
  }

  // @ts-ignore
  function updateCapList(list) {
    const newGroup = {
      ...(wordGroup || {}),
      isCapList: list
    }
    // @ts-ignore
    setWordGroup(newGroup);
  }


  function renderComponent() {
    const {
      notCapList,
      isCapList,
      notMatchList
    } = wordGroup;
    // return (<div>
    //   <pre>
    //     {JSON.stringify(wordGroup,null,2)}
    //   </pre>
    // </div>)


    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab="No Cap" key="1">
          <FreqWordList records={notCapList} onUpdate={updateNotCapList}/>
        </TabPane>
        <TabPane tab="Cap" key="2">
          <FreqWordList records={isCapList} onUpdate={updateCapList}/>
        </TabPane>
        <TabPane tab="Other" key="3">
          <OtherWordList records={notMatchList}/>
        </TabPane>
        <TabPane tab="Exported" key="5">
          <ProcessedArticlePage doc={props.sourceDoc}/>
        </TabPane>
      </Tabs>
    );
  }

  if (!props.wordGroup) {
    return null;
  }
  return (<div>
    {renderComponent()}
  </div>);

}


export default WordGroupNav;
