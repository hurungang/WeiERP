export default class TextFormater{
    pattern: string = "";
    defaultPlacer: string = "";
    constructor(pattern: string, defaultPlacer:string = "") {
        this.pattern = pattern;
        this.defaultPlacer = defaultPlacer;
    }

    format(...args:any[]):string {
        let defaultPlacer = this.defaultPlacer;
        return this.pattern.replace(/\{(\d+)\}/g, function(c, m) {
            return args[m-1] === undefined ? defaultPlacer : args[m-1];
        });
    }
}