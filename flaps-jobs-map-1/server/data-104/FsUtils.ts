const fs = require('fs');
const path = require('path');

interface IFileFilter {
  (fileName: string): boolean;
}

export interface IFileItem {
  fileName: string,
  fullPath: string,
}

function loopScanFile(parent: string, filter: IFileFilter): IFileItem[] {

  const fileNames = fs.readdirSync(parent);
  const result: IFileItem[] = [];
  fileNames.forEach((file:string) => {
    const fullPath = path.join(parent, file);
    if (fs.lstatSync(fullPath).isDirectory() == false) {
      if (filter(file)) {
        const item: IFileItem = {
          fileName: file,
          fullPath: fullPath,
        }
        result.push(item);
      }
    } else {
      const ll = loopScanFile(fullPath, filter);
      ll.forEach((r) => {
        result.push(r);
      })
    }
  });
  return result;
}


function readTextFileSync(fileName:string):string{
  const data = fs.readFileSync(fileName,
    {
      encoding: 'utf8',
      flag: 'r'
    });
  return data;
}
export const FsUtils = {
  loopScanFile,
  readTextFileSync
}
