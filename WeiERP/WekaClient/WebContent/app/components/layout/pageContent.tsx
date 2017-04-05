import * as React from 'react';

interface PageContentProps {}
export default class PageContent extends React.Component<PageContentProps,{}>{
  
  render(){
    return (
        <div className="right_col" role="main">
        	this.props.children
        </div>
    );
}}