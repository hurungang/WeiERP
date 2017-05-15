import * as React from 'react';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {Menu} from '../../models/modelTypes'
import {Link} from 'react-router'

interface SidebarMenuItemProps {menu:Menu}
interface SidebarMenuItemState {activeMenuId:number;}
export default class SidebarMenuItem extends React.Component<SidebarMenuItemProps,SidebarMenuItemState>{

  constructor(props:SidebarMenuItemProps,state:SidebarMenuItemState){
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
	let {menu} = this.props;
	let menus = menu.subMenus;
	if(menus!=undefined&&menus.length>0){
	    return (
    		<ul className="nav child_menu" key={`smi_ul_${menu.id}`}>
    		{menus.map((subMenu,index)=>{
    			let activeIndicator = (subMenu.id==this.state.activeMenuId)?"current-page":"";
	    			return 	(
    					<li className={activeIndicator} key={index}>
    						<Link to={subMenu.link} onClick={this.handleMenuClick.bind(this)} data-id={subMenu.id}>{subMenu.text}
    							<span className="fa fa-chevron-down"></span>
    						</Link>
    				    	<ReactCSSTransitionGroup
    			            transitionName="menuItemTransition"
    			                transitionEnterTimeout={500}
    			                transitionLeaveTimeout={300}>
    						{this.showSubMenu(subMenu)}
    				        </ReactCSSTransitionGroup>
    					</li>
    					)
	    		})} 
	        </ul>
	    )
	}else{
		return null;
	}
  }
}