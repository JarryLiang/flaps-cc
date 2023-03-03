import {Dictionary} from "/index";
import {Job104StatusApi} from "/server/api/Job104StatusApi";

const fs = require("fs");
const path = require("path");


async function resolveFullPath(itemName: string) {
  const root= await Job104StatusApi.getConfigItem("tempPath","c:\\temp");
  let fn=`cache-${itemName}.raw`;
  const fullPath =path.resolve(root,fn);
  return fullPath;
}

const _globalCache:Dictionary<string> = {};

async function clearCache() {
  const root= await Job104StatusApi.getConfigItem("tempPath","c:\\temp");
  const fileNames = fs.readdirSync(root);

  fileNames.forEach(file => {
    if(file.indexOf("cache-")==0){
      const targetFile = path.join(root,file);

      fs.unlink(targetFile, (err) => {
        if (err) {
          throw err;
        }else {
          console.log(`delete ${targetFile}`);
        }
      });
    }
  });

}

async function loadItem(itemName:string){

  if(_globalCache[itemName]){
    return _globalCache[itemName];
  }

  const fullPath =await resolveFullPath(itemName);

  if (fs.existsSync(fullPath)){
    const data = fs.readFileSync(fullPath,
      {
        encoding: 'utf8',
        flag: 'r'
      });
    _globalCache[itemName] = data;
    return data;
  }
  return null;
}

async function saveItem(itemName: string, value: string) {
  _globalCache[itemName] = value;

  const fullPath =await resolveFullPath(itemName);
  var stream = fs.createWriteStream(fullPath);
  stream.once('open', function(fd) {
    stream.write(value);
    stream.end();
  });

}

export const FileCacheApi ={
  loadItem,
  saveItem,
  clearCache
}
