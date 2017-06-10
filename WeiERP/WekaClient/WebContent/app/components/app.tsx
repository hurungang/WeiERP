import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Login from './login'
import Main from './main'
import {State} from '../reducers/reducerTypes'
import * as appActions from '../actions/appActions'

interface AppProps { 
	children: React.ReactElement<any>;
	state: State;
	dispatch: any;
	params: any;
}

class App extends React.Component<AppProps,{}>{
	
  componentWillMount(){
	  let {state,dispatch} = this.props;
	  //todo: skip login for development, should be removed later
	  let testUser = {name:'Harry',password:'test'};
	  //dispatch(appActions.APP_AUTHENTICATE_USER(testUser));
  }
  
  render(){
	  let {state,dispatch} = this.props;
	  let {register} = this.props.params;
	  if(register){
		  register = true;
	  }
	  let {user} = state.appState;
	  if(user!=null){
		  return (
				  <Main state={state} dispatch={dispatch} pageBody={this.props.children} params={this.props.params}/>
				  );
	  }else{
		  return (
				  <Login state={state} dispatch={dispatch} register={register}/>
		  )
	  }
	  
}}

function mapStateToProps(state) {
    return {
        state: state
    }
}

function mapDispatchToProps(dispatch){
  return {
	  dispatch: dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);