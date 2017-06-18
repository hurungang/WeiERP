import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Login from './login'
import Main from './main'
import { State } from '../reducers/reducerTypes'
import * as appActions from '../actions/appActions'

interface AppProps {
	children: React.ReactElement<any>;
	state: State;
	dispatch: any;
	params: any;
	location: any;
}

class App extends React.Component<AppProps, {}>{

	componentWillMount() {
		let { state, dispatch } = this.props;
		//todo: skip login for development, should be removed later
		//let testUser = { name: 'Harry', password: 'test' };

		let { register, token } = this.props.location.query;
		if (!register) {
			//dispatch(appActions.APP_AUTHENTICATE_USER(testUser));
			if (token) {
				dispatch(appActions.APP_AUTHENTICATE_USER_VIA_TOKEN(token));
			} else {

				let sessionUser = (window as any).sessionStorage.getItem("user");
				let sessionToken = (window as any).sessionStorage.getItem("token");
				if (sessionUser && sessionToken) {
					dispatch(appActions.APP_LOGIN(sessionUser));
					dispatch(appActions.APP_SET_TOKEN(sessionToken));
				}
			}
		}
	}

	render() {
		let { state, dispatch } = this.props;
		let { register, token } = this.props.location.query;
		let { user } = state.appState;
		if (user != null) {
			return (
				<Main state={state} dispatch={dispatch} pageBody={this.props.children} params={this.props.params} />
			);
		} else {
			return (
				<Login state={state} dispatch={dispatch} register={register?true:false} location={this.props.location} registerToken={token}/>
			)
		}

	}
}

function mapStateToProps(state) {
	return {
		state: state
	}
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch: dispatch,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);