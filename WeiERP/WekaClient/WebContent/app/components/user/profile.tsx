import * as React from 'react';
import {User} from '../../models/modelTypes'

interface ProfileProps {user:User;}
export default class Profile extends React.Component<ProfileProps,{}>{
  
  render(){
	let {user} = this.props;
    return (
    	<div className="profile">
            <div className="profile_pic">
              <img src="images/img.jpg" alt="..." className="img-circle profile_img"/>
            </div>
            <div className="profile_info">
              <span>Welcome,</span>
              <h2>{user.name}</h2>
            </div>
        </div>
    );
}}