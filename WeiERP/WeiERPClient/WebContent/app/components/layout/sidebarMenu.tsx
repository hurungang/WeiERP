import * as React from 'react';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {User,Menu} from '../../models/modelTypes'
import SidebarMenuItem from './sidebarMenuItem'

interface SidebarMenuProps {
menu:Menu;
isSmallMenuMode: boolean;
}
interface SidebarMenuState {activeMenuId:number;}

export default class SidebarMenu extends React.Component<SidebarMenuProps,SidebarMenuState>{
  constructor(props:SidebarMenuProps,state:SidebarMenuState){
	  super();
	  this.state = {
			  activeMenuId:null
	  };
  }

  handleMenuClick(event:any){
	  if(this.state.activeMenuId!=Number(event.currentTarget.dataset.id)){
		  this.setState({activeMenuId:Number(event.currentTarget.dataset.id)});
	  }else{
		  this.setState({activeMenuId:null});
	  }
  }
  
  showSubMenu(menu:Menu){
	  return menu.id==this.state.activeMenuId?<SidebarMenuItem key={`sm_smi_${menu.id}`} menu={menu}/>:null;
  }
  
  render(){
	let {menu,isSmallMenuMode} = this.props;
	let {activeMenuId} = this.state;
    return (
    		<div id="sidebar-menu" className="main_menu_side hidden-print main_menu">

    		{/*display menu sections */}
    		{menu.subMenus.map(subMenu=>{
		            return (
			            <div className="menu_section" key={`sm_div_${subMenu.id}`}>
			              <h3 key={`sm_h3_${subMenu.id}`}>{subMenu.text}</h3>
			              <ul key={`sm_ul_${subMenu.id}`} className="nav side-menu">
			      		  {/*display first level menu sections */}
			              {subMenu.subMenus.map(l1Menu=>{
			      			let activeIndicator = (l1Menu.id==this.state.activeMenuId)?"active":"";
			      			activeIndicator = isSmallMenuMode&&activeIndicator=="active"?"active-sm":activeIndicator;
			                    return (
				                    <li key={`sm_li_${l1Menu.id}`} className={activeIndicator}>
				                    	<a key={`sm_a_${l1Menu.id}`} onClick={this.handleMenuClick.bind(this)} data-id={l1Menu.id}>
				                    		<i key={`sm_i_${l1Menu.id}`} className={`fa ${l1Menu.icon}`}></i> {l1Menu.text} 
				                    		<span key={`sm_span_${l1Menu.id}`} className="fa fa-chevron-down"></span>
				                    	</a>
				            	    <ReactCSSTransitionGroup
				        	            transitionName="menuItemTransition"
				        	                transitionEnterTimeout={500}
				        	                transitionLeaveTimeout={300}>
				                    {this.showSubMenu(l1Menu)}
				            		</ReactCSSTransitionGroup>
				                    </li>
			                    )})}
			              </ul>
			            </div>
		            );
    			})}
          </div>
    );
   }
    		
}