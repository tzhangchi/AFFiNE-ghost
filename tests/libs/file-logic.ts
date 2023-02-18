import fs from 'fs';
import path from 'path';

function scanDirs(targtDir: string) {
  let collectObj = {
    filesList: [],
    dirsList: [],
  };

  function readFileList(
    dir: string,
    collectObj: {
      filesList: string[];
      dirsList: string[];
    }
  ) {
    const { filesList, dirsList } = collectObj;
    const files = fs.readdirSync(dir);
    files.forEach((item, index) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        dirsList.push(fullPath);
        readFileList(path.join(dir, item), collectObj); //递归读取文件
      } else {
        filesList.push(fullPath);
      }
    });
    return collectObj;
  }
  //@ts-ignore
  collectObj = readFileList(targtDir, collectObj);

  return collectObj;
}

function removeRootName(filesList: string[], rootName: string) {
  return filesList.map(item => {
    return item.slice(rootName.length - 1, item.length);
  });
}

export { removeRootName, scanDirs };
