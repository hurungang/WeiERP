import * as React from 'react';

interface ErrorAlertProps {
    errorSummary:string;
    errorDetail:string;
}
export default class ErrorAlert extends React.Component<ErrorAlertProps,{}>{
  
  render(){
	let {errorSummary,errorDetail} = this.props;
    return (
        <div className="col-xs-12">
            <div className="alert alert-danger alert-dismissible fade in">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                </button>
                <h1>{errorSummary}</h1>
                <h3>{errorDetail}</h3>
            </div>
        </div>
    );
}}