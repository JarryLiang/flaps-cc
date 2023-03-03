import React from 'react';

interface IProps {
  data:any
}

function JsonPre(props:IProps) {
  const { data } = props;
  if(!data){
    return null;
  }
  return (
    <pre>
      {JSON.stringify(data,null,2)}
    </pre>
  );
}


export default JsonPre;
