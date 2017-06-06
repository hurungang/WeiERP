import { TextPattern } from '../util/messageAnalyst'
import { MessageSectionCategory } from '../model/enums'
import { Environment } from "../model/models";

export const APP_NAME = "Weka";
export const WELCOME_WORD = "Welcome to use Weka";
export const LOG_FILE_EXPRESS = "logs/log_express.log";
export const LOG_FILE = "logs/_app.log";
export const DATE_PATTERN = "yyyy_MM_dd";
export const ENV : Environment = "development" //change this to production when go live;
export const SECRET_KEY = "IloveWeka";
export const TOKEN_EXPIRES_IN_SECONDS = 1440*60;
export const SERVER_PORT = 80;
export const SERVER_PORT_DEV = 3000;

export class MESSAGE_ANALYST_CONFIG {
  static REGEX_SPLITTER = /[ $-/:-?{-~!"^_`\[\]|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/
  static REGEX_MIXED = /[\u00ff-\uffff]|\S/g;
  static REGEX_ENGLISH = /([A-Za-z])/g;
  static REGEX_NUMBER = /([0-9])/g;
  static REGEX_CHINESE = /[\u4e00-\u9fff\uf900-\ufaff]/g;
  static REGEX_SYMBOL = /[$-/:-?{-~!"^_`\[\]|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g;
  static ORDER_PATTERNS: TextPattern[] = [{
    category: MessageSectionCategory.Name,
    countEnglish:   {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countNumber:    {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countChinese:   {minimalLength: 0,maximalLength: 5,lowerLength: 2,higherLength: 4, weight: 10,},
    countSymbol:    {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    keywords: "赵;钱;孙;李;周;吴;郑;王;冯;陈;褚;卫;蒋;沈;韩;杨;朱;秦;尤;许;何;吕;施;张;孔;曹;严;华;金;魏;陶;姜;戚;谢;邹;喻;柏;水;窦;章;云;苏;潘;葛;奚;范;彭;郎;鲁;韦;昌;马;苗;凤;花;方;俞;任;袁;柳;酆;鲍;史;唐;费;廉;岑;薛;雷;贺;倪;汤;滕;殷;罗;毕;郝;邬;安;常;乐;于;时;傅;皮;卞;齐;康;伍;余;元;卜;顾;孟;平;黄;和;穆;萧;尹;姚;邵;湛;汪;祁;毛;禹;狄;米;贝;明;臧;计;伏;成;戴;谈;宋;茅;庞;熊;纪;舒;屈;项;祝;董;梁;杜;阮;蓝;闵;席;季;麻;强;贾;路;娄;危;江;童;颜;郭;梅;盛;林;刁;锺;徐;邱;骆;高;夏;蔡;田;樊;胡;凌;霍;虞;万;支;柯;昝;管;卢;莫;经;房;裘;缪;干;解;应;宗;丁;宣;贲;邓;郁;单;杭;洪;包;诸;左;石;崔;吉;钮;龚;程;嵇;邢;滑;裴;陆;荣;翁;荀;羊;於;惠;甄;麹;家;封;芮;羿;储;靳;汲;邴;糜;松;井;段;富;巫;乌;焦;巴;弓;牧;隗;山;谷;车;侯;宓;蓬;全;郗;班;仰;秋;仲;伊;宫;甯;仇;栾;暴;甘;钭;厉;戎;祖;武;符;刘;景;詹;束;龙;叶;幸;司;韶;郜;黎;蓟;薄;印;宿;白;怀;蒲;邰;从;鄂;索;咸;籍;赖;卓;蔺;屠;蒙;池;乔;阴;鬱;胥;能;苍;双;闻;莘;党;翟;谭;贡;劳;逄;姬;申;扶;堵;冉;宰;郦;雍;郤;璩;桑;桂;濮;牛;寿;通;边;扈;燕;冀;郏;浦;尚;农;温;别;庄;晏;柴;瞿;阎;充;慕;连;茹;习;宦;艾;鱼;容;向;古;易;慎;戈;廖;庾;终;暨;居;衡;步;都;耿;满;弘;匡;国;文;寇;广;禄;阙;东;欧;殳;沃;利;蔚;越;夔;隆;师;巩;厍;聂;晁;勾;敖;融;冷;訾;辛;阚;那;简;饶;空;曾;毋;沙;乜;养;鞠;须;丰;巢;关;蒯;相;查;后;荆;红;游;竺;权;逯;盖;益;桓;公;万;俟;司;马;上;官;欧;阳;夏;侯;诸;葛;闻;人;东;方;赫;连;皇;甫;尉;迟;公;羊;澹;台;公;冶;宗;政;濮;阳;淳;于;单;于;太;叔;申;屠;公;孙;仲;孙;轩;辕;令;狐;锺;离;宇;文;长;孙;慕;容;鲜;于;闾;丘;司;徒;司;空;亓;官;司;寇;仉;督;子;车;颛;孙;端;木;巫;马;公;西;漆;雕;乐;正;壤;驷;公;良;拓;跋;夹;谷;宰;父;穀;梁;晋;楚;闫;法;汝;鄢;涂;钦;段;干;百;里;东;郭;南;门;呼;延;归;海;羊;舌;微;生;岳;帅;缑;亢;况;後;有;琴;梁;丘;左;丘;东;门;西;门;商;牟;佘;佴;伯;赏;南;宫;墨;哈;谯;笪;年;爱;阳;佟;第;五;言;福;",
    keywordsWeight: 10,
    required: true,
    priority: 1,
    multiple: false,
  },{
    category: MessageSectionCategory.Address,
    countEnglish:   {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countNumber:    {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countChinese:   {minimalLength: 4,maximalLength: 40,lowerLength: 10,higherLength: 20, weight: 1,},
    countSymbol:    {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    keywords: "省;县;区;镇;街道;社区;村;组;路;小区;号;幢;单元;楼;栋",
    keywordsWeight: 20,
    required: true,
    priority: 1,
    multiple: false,
  },{
    category: MessageSectionCategory.CommodityName,
    countEnglish:   {minimalLength: 0,maximalLength: 20,lowerLength: 3,higherLength: 10, weight: 1,},
    countNumber:    {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countChinese:   {minimalLength: 4,maximalLength: 40,lowerLength: 3,higherLength: 20, weight: 1,},
    countSymbol:    {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    keywords: "护肝片;维生素",
    keywordsWeight: 20,
    required: true,
    priority: 1,
    multiple: true,
  },{
    category: MessageSectionCategory.Mobile,
    countEnglish:   {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countNumber:    {minimalLength: 8,maximalLength: 20,lowerLength: 8,higherLength: 13, weight: 20,},
    countChinese:   {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countSymbol:    {minimalLength: 0,maximalLength: 3,lowerLength: 0,higherLength: 1, weight: 1,},
    keywords: "",
    keywordsWeight: 0,
    required: true,
    priority: 1,
    multiple: true,
  },{
    category: MessageSectionCategory.Quantity,
    countEnglish:   {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countNumber:    {minimalLength: 1,maximalLength: 3,lowerLength: 1,higherLength: 2, weight: 20,},
    countChinese:   {minimalLength: 0,maximalLength: 2,lowerLength: 0,higherLength: 2, weight: 10,},
    countSymbol:    {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 0,},
    keywords: "瓶;盒;箱;件;个;只;罐;条;袋;支;管",
    keywordsWeight: 10,
    required: true,
    priority: 1,
    multiple: true,
  },
  ]
  
  static getOrderPattern(category:MessageSectionCategory):TextPattern{
    for(let pattern of MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS){
      if(pattern.category == category){
        return pattern;
      }
    }
    return null;
  }
}