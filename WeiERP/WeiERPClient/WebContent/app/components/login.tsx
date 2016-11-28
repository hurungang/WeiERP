import * as React from 'react';
import {User} from '../models/modelTypes'
import {State} from '../reducers/reducerTypes'
import * as appActions from '../actions/appActions'

interface LoginProps { 
	dispatch:any;
	state:State;
}

export default class Login extends React.Component<LoginProps,{}>{
	refs: {
	    [key: string]: (Element);
	    name: (HTMLInputElement);
	    password: (HTMLInputElement);
	}

	handleLogin(event){
		let {dispatch} = this.props;
		let user:User = {name:this.refs.name.value,
				password : this.refs.password.value};
		dispatch(appActions.APP_LOGIN(user));
	}
	
  render(){
    return (
		  <div className="login">
	      <a className="hiddenanchor" id="signup"></a>
	      <a className="hiddenanchor" id="signin"></a>

	      <div className="login_wrapper">
	        <div className="animate form login_form">
	          <section className="login_content">
	            <form>
	              <h1>Login Form</h1>
	              <div>
	                <input type="text" className="form-control" placeholder="Username" defaultValue="Harry Hu" ref="name" required={true} />
	              </div>
	              <div>
	                <input type="password" className="form-control" placeholder="Password" ref="password" required={true} />
	              </div>
	              <div>
	                <a className="btn btn-default submit" onClick={this.handleLogin.bind(this)}>Log in</a>
	                <a className="reset_pass" href="#">Lost your password?</a>
	              </div>

	              <div className="clearfix"></div>

	              <div className="separator">
	                <p className="change_link">New to site?
	                  <a href="#signup" className="to_register"> Create Account </a>
	                </p>

	                <div className="clearfix"></div>
	                <br />

	                <div>
	                  <h1><i className="fa fa-paw"></i> Gentelella Alela!</h1>
	                  <p>�2016 All Rights Reserved. Gentelella Alela! is a Bootstrap 3 template. Privacy and Terms</p>
	                </div>
	              </div>
	            </form>
	          </section>
	        </div>

	        <div id="register" className="animate form registration_form">
	          <section className="login_content">
	            <form>
	              <h1>Create Account</h1>
	              <div>
	                <input type="text" className="form-control" placeholder="Username" required={false} />
	              </div>
	              <div>
	                <input type="email" className="form-control" placeholder="Email" required={false} />
	              </div>
	              <div>
	                <input type="password" className="form-control" placeholder="Password" required={false} />
	              </div>
	              <div>
	                <a className="btn btn-default submit" href="index.html">Submit</a>
	              </div>

	              <div className="clearfix"></div>

	              <div className="separator">
	                <p className="change_link">Already a member ?
	                  <a href="#signin" className="to_register"> Log in </a>
	                </p>

	                <div className="clearfix"></div>
	                <br />

	                <div>
	                  <h1><i className="fa fa-paw"></i> Gentelella Alela!</h1>
	                  <p>�2016 All Rights Reserved. Gentelella Alela! is a Bootstrap 3 template. Privacy and Terms</p>
	                </div>
	              </div>
	            </form>
	          </section>
	        </div>
	      </div>
	    </div>		
    );
  }
}