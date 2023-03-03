const createHash = require('create-hash');

function createMD5() {
  return createHash('md5');
}


function doMD5(str:string):string {
  const MD5 = createMD5();
  MD5.update(str);
  const hash = MD5.digest();
  const result = hash.toString('base64');
  return result.slice(0,10);
}


export const DigestUtils = {
  doMD5
}
