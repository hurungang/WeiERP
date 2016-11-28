import * as React from 'react';
import Profile from '../user/profile'
import SidebarMenu from './sidebarMenu'
import MenuFooter from './menuFooter'
import {User} from '../../models/modelTypes'

interface LeftColumnProps {
user:User; 
navTitle:string;
isSmallMenuMode: boolean;
}
export default class LeftColumn extends React.Component<LeftColumnProps,{}>{
  
  render(){
	let {user,navTitle} = this.props;
	let menu = {
			id:1,text:"Root",link:"",icon:"",subMenus:[
				{
					id:2,text:"General",link:"",icon:"",subMenus:[
						{
							id:3,text:"Dashboard",link:"",icon:"fa-home",subMenus:[
								{
									id:4,text:"menu 3",link:"",icon:"",subMenus:[
										{
											id:6,text:"menu 6",link:"",icon:""
										}]
								}
							] 
						},{
							id:4,text:"Order Management",link:"",icon:"fa-edit",subMenus:[
								{
									id:5,text:"Order",link:"order",icon:""
								}
							] 
						}
					] 
				},
				{
					id:10,text:"menu 10",link:"",icon:"",subMenus:[
						{
							id:11,text:"menu 11",link:"",icon:"fa-table",subMenus:[
								{
									id:12,text:"menu 12",link:"",icon:""
								}
							] 
						}
					] 
				}
			] 
	}
	let {isSmallMenuMode} = this.props;
    return (
	        <div className="col-md-3 left_col">
	          <div className="left_col scroll-view">
	          	{/*<!--logo*/}
	            <div className="navbar nav_title">
	              <a href="/" className="site_title"><i className="fa fa-paw"></i> <span>{navTitle}</span></a>
	            </div>
	            <div className="clearfix"></div>
				{/*logo-->*/}
				
	            {/* <!-- menu profile quick info*/}
	            <Profile user={user}/>
	            {/*menu profile quick info -->*/}


	            {/*<!-- sidebar menu*/}
	            <SidebarMenu isSmallMenuMode={isSmallMenuMode} menu={menu}/>
	            {/*sidebar menu -->*/}

	            {/*<!-- menu footer buttons*/}
	            <MenuFooter/>
	            {/*menu footer buttons -->*/}
	          </div>
	        </div>
    );
}}