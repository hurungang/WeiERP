import * as React from 'react';

interface XTitleProps {
    title:string;
    smallTitle?: string;
    settings?: any[];
}
export default class XTitle extends React.Component<XTitleProps,{}>{
  
  render(){
	let {title,smallTitle,settings} = this.props;
    
    return (
            <div className="x_title">
                <h2>{title} <small>{smallTitle}</small></h2>
                <ul className="nav navbar-right panel_toolbox">
                                            {settings?
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-wrench"></i></a>

                            <ul className="dropdown-menu" role="menu">
                            {settings.map((setting)=>{
                                return (
                                <li><a onClick={setting.handleClick.bind(this)}>{setting.name}</a></li>
                                );
                            })}
                            </ul>
                    </li>
                        :null}
                </ul>
                <div className="clearfix"></div>
            </div>
    );
}}