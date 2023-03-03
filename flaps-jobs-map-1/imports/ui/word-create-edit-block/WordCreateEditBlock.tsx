import AddVocabularyBlock from "/imports/ui/add-vocabulary-block/AddVocabularyBlock";
import EditVocabularyBlock from "/imports/ui/edit-vocabulary-block/EditVocabularyBlock";
import {IWordFreq} from "/server/api/words-api";
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';


const Holder = styled.div`
  margin: 8px;
  padding: 8px;
  border-radius: 4px;
  border: solid 1px #CCC;
`;

interface IProps {
  voc: string;
  record: IWordFreq;
}

function WordCreateEditBlock(props: IProps) {
  const {voc, record} = props;



  if (!record) {
    return (<AddVocabularyBlock text={voc}/>);
  }
  return (<EditVocabularyBlock record={record}/>);

}


export default WordCreateEditBlock;
