export default class KeywordSearchUtil {
  matchedIndexArray: number[];
  constructor(content: string, strKeys: string) {
    let keywordTree = this.makeTree(strKeys);
    this.matchedIndexArray = this.search(content,keywordTree);
  }
  
  public getMatchCounts(){
    return this.matchedIndexArray?this.matchedIndexArray.length:0;
  }
  
  private makeTree(strKeys: string): any {
    let tblRoot:any;
    let arrKeys:string[] = strKeys.split("");
    let tblCur:any = tblRoot = {};

    for (var i = 0, n = arrKeys.length; i < n; i++) {
      let key = arrKeys[i];

      if (key == ';')    //完成当前关键字
      {
        tblCur.end = true;
        tblCur = tblRoot;
        continue;
      }

      if (key in tblCur) //生成子节点
        tblCur = tblCur[key];
      else
        tblCur = tblCur[key] = {};
    }

    tblCur.end = true;    //最后一个关键字没有分割符
    return tblRoot;
  }

  private search(content: string, tblRoot: any):number[] {
    var tblCur;
    var i = 0;
    var n = content.length;
    var p, v;
    var arrMatch = [];

    while (i < n) {
      tblCur = tblRoot;
      p = i;
      v = 0;

      for (; ;) {
        if (!(tblCur = tblCur[content.charAt(p++)])) {
          i++;
          break;
        }

        if (tblCur.end)    //找到匹配关键字
          v = p;
      }

      if (v)         //最大匹配
      {
        arrMatch.push(i - 1, v);
        i = v;
      }
    }

    return arrMatch;
  }
};