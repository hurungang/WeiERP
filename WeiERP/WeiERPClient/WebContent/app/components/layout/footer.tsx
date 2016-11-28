import * as React from 'react';

interface FooterProps {footerText:string}
export default class Footer extends React.Component<FooterProps,{}>{
  
  render(){
	let {footerText} = this.props;
    return (
    	<footer>
	        <div className="pull-right">
	          {footerText}
	        </div>
	        <div className="clearfix"></div>
        </footer>
    );
}}