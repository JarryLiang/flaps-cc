import React,{useState} from 'react';

interface IProps {
  defaultValue:number;
  onUpdate:(value:number)=>void;
}

function NumberInput(props:IProps) {
  const { defaultValue ,onUpdate } = props;
  const [value,setValue ] = useState(""+(defaultValue || 0));


  function handleTextChange(e){
    const t=e.target.value;
    setValue(t);
    try{
      const v=parseFloat(t)
      onUpdate(v);
    }catch (e) {

    }

  }
  return (
      <input value={value} onChange={handleTextChange} />

  );
}


export default NumberInput;
