import * as React from 'react';

interface AlertProps {
    summary:string;
    detail?:string;
    type: "error"|"success"|"information"|"warning";
}
export default class Alert extends React.Component<AlertProps,{}>{
  
  render(){
	let {summary,detail,type} = this.props;
    let alertCSS = "alert-success";
    if(type=="error"){
        alertCSS = "alert-danger";
    }else if(type=="information"){
        alertCSS = "alert-info";
    }else if(type=="warning"){
        alertCSS = "alert-warning";
    }
    return (
        <div className="col-xs-12">
            <div className={`alert ${alertCSS} alert-dismissible fade in`}>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                </button>
                <h1>{summary}</h1>
                <h3>{detail}</h3>
            </div>
        </div>
    );
}}