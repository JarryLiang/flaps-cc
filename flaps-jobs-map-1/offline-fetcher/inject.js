



function fetchSimpleTranslation(){

  try{
    const entry =document.querySelector(".entry");
    const headword = entry.querySelector(".headword");
    const word = headword.innerText;
    const sense_body = entry.querySelector(".sense-body");
    const trans = sense_body.querySelector(".trans");
    const translate=trans.innerText;
    return {
      word,
      translate
    }
  }catch (e){
    return {

    }
  }

}
