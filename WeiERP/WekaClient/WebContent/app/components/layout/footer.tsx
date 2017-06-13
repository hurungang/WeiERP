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
	        <div id="debugDiv"></div>
        </footer>
    );
}}


  if (typeof console  != "undefined") 
    if (typeof console.log != 'undefined')
        console['olog'] = console.log;
    else
        console['olog'] = function() {};

console.log = function(message) {
    console['olog'](message);
    let element = document.getElementById('debugDiv');
		element.innerHTML = element.innerHTML + '<p>' + message + '</p>';
};

console.error = console.debug = console.info =  console.log
