export default class StringSimilarityUtil {


  static min(one: number, two: number, three: number): number {
    let min = one;
    if (two < min) {
      min = two;
    }
    if (three < min) {
      min = three;
    }
    return min;
  }

  static ld(str1: string, str2: string): number {
    let d=[][]; // 矩阵
    let n = str1.length;
    let m = str2.length;
    let i; // 遍历str1的
    let j; // 遍历str2的
    let ch1; // str1的
    let ch2; // str2的
    let temp; // 记录相同字符,在某个矩阵位置值的增量,不是0就是1
    if (n == 0) {
      return m;
    }
    if (m == 0) {
      return n;
    }
    for (i = 0; i <= n; i++) { // 初始化第一列
      d[i][0] = i;
    }
    for (j = 0; j <= m; j++) { // 初始化第一行
      d[0][j] = j;
    }
    for (i = 1; i <= n; i++) { // 遍历str1
      ch1 = str1.charAt(i - 1);
      // 去匹配str2
      for (j = 1; j <= m; j++) {
        ch2 = str2.charAt(j - 1);
        if (ch1 == ch2) {
          temp = 0;
        } else {
          temp = 1;
        }
        // 左边+1,上边+1, 左上角+temp取最小
        d[i][j] = StringSimilarityUtil.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + temp);
      }
    }
    return d[n][m];
  }

  static sim(str1: string, str2: string): number {
    let ld = StringSimilarityUtil.ld(str1, str2);
    return 1 - (ld / Math.max(str1.length, str2.length));
  }

}