import fs from 'fs';
import path from 'path';

function scanDirs(targtDir: string) {
  let collectObj = {
    fileList: [],
    dirsList: [],
  };

  function readFileList(
    dir: string,
    collectObj: {
      fileList: string[];
      dirsList: string[];
    }
  ) {
    const { fileList, dirsList } = collectObj;
    const files = fs.readdirSync(dir);
    files.forEach((item, index) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        dirsList.push(fullPath);
        readFileList(path.join(dir, item), collectObj); //递归读取文件
      } else {
        fileList.push(fullPath);
      }
    });
    return collectObj;
  }
  //@ts-ignore
  collectObj = readFileList(targtDir, collectObj);

  return collectObj;
}

function removePrefixOfFileList(fileList: string[], rootName: string) {
  if (!rootName.endsWith('/')) {
    rootName += '/';
  }
  return fileList.map(item => {
    return item.replace(rootName, '');
  });
}

export { removePrefixOfFileList, scanDirs };
