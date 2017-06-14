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

// used for debug in mobile browser

//   if (typeof console  != "undefined") 
//     if (typeof console.log != 'undefined')
//         console['olog'] = console.log;
//     else
//         console['olog'] = function() {};

// console.log = function(message,...restArgs) {
//     console['olog'](message,...restArgs);
//     let element = document.getElementById('debugDiv');
// 		if(element){
// 			element.innerHTML = element.innerHTML + '<p>' + message + restArgs + '</p>';
// 		}
// };

// console.error = console.debug = console.info =  console.log
