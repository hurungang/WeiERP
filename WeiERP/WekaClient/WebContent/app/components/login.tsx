import * as React from 'react';
import { User } from '../models/modelTypes'
import { State } from '../reducers/reducerTypes'
import * as appActions from '../actions/appActions'
import ErrorAlert from "./elements/errorAlert";
import { Link } from "react-router";

interface LoginProps {
	dispatch: any;
	state: State;
	register: boolean;
	location: any;
	registerToken?: string;
}

export default class Login extends React.Component<LoginProps, { formValidated: boolean,formValidationMap: Map<any,boolean>; }>{
	refs: {
		[key: string]: (Element);
		name: (HTMLInputElement);
		password: (HTMLInputElement);
		sender: (HTMLInputElement);
		phone: (HTMLInputElement);
		address: (HTMLInputElement);
	}
	constructor() {
		super();
		this.state = { formValidated: true,formValidationMap: new Map<any,boolean>() };
	}

	handleLogin(event) {
		let { dispatch } = this.props;
		let user: User = {
			name: this.refs.name.value,
			password: this.refs.password.value
		};
		dispatch(appActions.APP_AUTHENTICATE_USER(user));
	}

	validatePassword(event) {
		if (event.target.value != this.refs.password.value) {
      		let newMap = this.state.formValidationMap.set("validatePasswordError",true);
			this.setState({ formValidated: false, formValidationMap: newMap });
		} else {
      		let newMap = this.state.formValidationMap;
			newMap.delete("validatePasswordError");
			this.setState({ formValidated: true, formValidationMap: newMap });
		}
	}

	handleRegister(event) {
		if(this.state.formValidated){
			let { dispatch } = this.props;
			let { openid, token } = this.props.location.query;
			let user = {
				name: this.refs.name.value,
				password: this.refs.password.value,
				sender: this.refs.sender.value,
				phone: this.refs.phone.value,
				address: this.refs.address.value,
				token: token,
			}
			dispatch(appActions.APP_REGISTER_USER(user));
		}
	}

	render() {
		let { language, error } = this.props.state.appState;
		let { register, registerToken } = this.props;
		let textPac = language.textPackage;
		let title = textPac.user.loginTitle;
		let buttonText = textPac.button.login;
		if(register){
			title = textPac.user.registerTitle;
			buttonText = textPac.button.register;
			let isBind = false;
			if(registerToken){
				isBind = true;
				title = textPac.user.bindTitle;
				buttonText = textPac.button.bind;
			}
		}
		
		return (
			<div className="login">
				<a className="hiddenanchor" id="signup"></a>
				<a className="hiddenanchor" id="signin"></a>

				<div className="login_wrapper">
					<div className="animate form login_form">
						<section className="login_content">
							<form>
								<h1>{title}</h1>
								<div>
									<input type="text" className="form-control" placeholder={textPac.user.name} defaultValue="Harry" ref="name" required={true} />
								</div>
								<div>
									<input type="password" className="form-control" placeholder={textPac.user.password} ref="password" required={true} />
								</div>
								{register ?
									<div>
										<div>
											<input type="password" className={this.state.formValidationMap.get("validatePasswordError")?"form-control bad":"form-control"} placeholder={textPac.user.passwordConfirm} required={true} onChange={this.validatePassword.bind(this)} />
										</div>
										<div>
											<input type="text" className="form-control" placeholder={textPac.user.senderName} ref="sender" required={true} />
										</div>
										<div>
											<input type="text" className="form-control" placeholder={textPac.user.phone} ref="phone" required={true} />
										</div>
										<div>
											<input type="text" className="form-control" placeholder={textPac.user.address} ref="address" required={true} />
										</div>
										<div>

											{error ? <ErrorAlert errorSummary={textPac.errorMessage[error.errorCode]} errorDetail={error.errorDetail} /> : ""}
											<button className="btn btn-success pull-right" disabled={this.state.formValidationMap.size>0}  onClick={this.handleRegister.bind(this)}>{buttonText}</button>
															
											<Link to="/" >Already registered?</Link>
										</div>
									</div>
									: 
								<div>

									{error ? <ErrorAlert errorSummary={textPac.errorMessage[error.errorCode]} errorDetail={error.errorDetail} /> : ""}
									<a className="btn btn-default submit" onClick={this.handleLogin.bind(this)}>{buttonText}</a>
									<a className="reset_pass" href="#">Lost your password?</a>
								</div>
								}
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