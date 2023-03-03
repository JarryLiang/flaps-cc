import _S from 'underscore.string';
import React from 'react';

const idReg = /^[a-zA-Z][a-z0-9\-_]+/i;

const idRegDigital = /^[a-zA-Z0-9][a-z0-9\-_]+/i;


function checkValidId(str, digitalFront) {

  if (typeof str === 'string') {
    if (digitalFront) {
      const m = str.match(idRegDigital);
      if (m) {
        if (m[0].length === str.length) {
          return true;
        }
      }
    } else {
      const m = str.match(idReg);
      if (m) {
        if (m[0].length === str.length) {
          return true;
        }
      }
    }
  }
  return false;
}


function checkNumber(value, cb) {
  if (typeof value === 'number') {
    if (cb) {
      return cb(value);
    }
    return true;
  }
  return false;
}

function isNullOrUndefined(target) {
  if (target === null) {
    return true;
  }
  if (target === undefined) {
    return true;
  }
  return false;
}


function trimString(str) {
  if (typeof str === 'string') {
    const s1 = str.trim();
    if (s1.length === str.length) {
      return str;
    }
    return s1;
  }
  return str;
}

function isEmptyObject(target) {
  if (isNullOrUndefined(target)) {
    return true;
  }
  if (Object.keys(target).length === 0) {
    return true;
  }
  return false;
}

function jsonCopy(data) {
  if (isNullOrUndefined(data)) {
    return null;
  }
  return JSON.parse(JSON.stringify(data));
}

function jsonPre(data) {
  return (
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function toHtmlFriendly(source) {
  if (source) {
    return source.replace(/_/g, '').replace(/-/g, '').replace(/\+/g, '').replace(/\//g, '')
      .replace(/\=+$/, '');
  }
  return source;
}

function getByteSize(a) {
  if (a) {
    return new Blob([a]).size;
  }
  return 0;
}

function prefixZero(value, n) {
  const text = `00000${value}`;
  return text.slice(text.length - n);
}

function prefixZeroMax(value, max) {
  const text = `00000${value}`;
  const n = Math.ceil(Math.log10(max));
  return prefixZero(value, n);
}


function isStringContains(a,b){
  if(isBlank(b)){
    return false;
  }
  if(isBlank(a)){
    return false;
  }
  const a1=a.toLowerCase();
  const b1=b.toLowerCase();

  if(a1.indexOf(b1)>=0){
    return true;
  }
  return false;

}
function isBlank(str) {
  if (str === undefined) {
    return true;
  }

  if (str === null) {
    return true;
  }
  return (/^\s*$/.test(str));
}

function refineLines(lines) {
  const result = [];
  lines.forEach((l) => {
    if (l) {
      const l2 = l.trim();
      if (isBlank(l2) === false) {
        result.push(l2);
      }
    }
  });
  return result;
}

function toValidLines(text) {
  const lines = _S.lines(text);
  const result = [];
  lines.forEach((l) => {
    if (!isBlank(l)) {
      result.push(l.trim());
    }
  });
  return result;
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log(`Fallback: Copying text command was ${msg}`);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}


function utf8ArrayToStr(array) {
  let out,
    i,
    c;
  let char2,
    char3;

  out = '';
  const len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12)
          | ((char2 & 0x3F) << 6)
          | ((char3 & 0x3F) << 0));
        break;
    }
  }

  return out;
}


function isJsonEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function isEmpty(a) {
  if (a === null) {
    return true;
  }

  if (a === undefined) {
    return true;
  }

  if (Array.isArray(a)) {
    return (a.length === 0);
  }

  const type = typeof (a);
  if (type === 'string') {
    return isBlank(a);
  }

  if (type === 'object') {
    return (Object.keys(a).length === 0);
  }


  return false;
}

function isBlankString(v) {
  if(v===undefined){
    return true;
  }

  if(v===null){
    return true;
  }
  if(typeof (v)==="string"){
    return isBlank(v);
  }
  return false;
}
function   removeLDBlank(newItem, checkList) {
  checkList.forEach((key)=>{
    const v= newItem[key];
    if(isBlankString(v)){
      newItem[key]=null;
    }
  });
}

function toJson(o,skipNull){
  return JSON.stringify(o, (key, value) => {
    if(skipNull){
      if (value !== null) return value
    }else {
      return value;
    }
  },2);
}

const preJson = jsonPre;
export {
  checkValidId,
  isEmpty,
  isNullOrUndefined,
  isBlank,
  trimString,
  checkNumber,
  fallbackCopyTextToClipboard,
  toValidLines,
  isEmptyObject,
  jsonPre,
  preJson,
  toHtmlFriendly,
  utf8ArrayToStr,
  getByteSize,
  jsonCopy,
  isJsonEqual,
  refineLines,
  prefixZero,
  prefixZeroMax,
};

function localeCompare(a,b) {
  const av =a || "";
  const bv =b || "";
  return av.localeCompare(bv);
}
function firstNotBlank(UnityAddressFemale, UnityAddressMale) {
  if(!isBlank(UnityAddressFemale)){
    return UnityAddressFemale;
  }
  if(!isBlank(UnityAddressMale)){
    return UnityAddressMale;
  }
  return undefined;
}
export const StringUtils = {
  isStringContains,
  checkValidId,
  isEmpty,
  isNullOrUndefined,
  isBlank,
  localeCompare,
  trimString,
  checkNumber,
  fallbackCopyTextToClipboard,
  toValidLines,
  isEmptyObject,
  jsonPre,
  preJson,
  toHtmlFriendly,
  utf8ArrayToStr,
  getByteSize,
  jsonCopy,
  isJsonEqual,
  refineLines,
  prefixZero,
  prefixZeroMax,
  removeLDBlank,
  toJson,
  firstNotBlank
}
