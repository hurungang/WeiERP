import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Login from './login'
import Main from './main'
import {AppState} from '../reducers/reducerTypes'

interface AppProps { 
	children: React.ReactElement<any>;
	state: State;
	dispatch: any;
	params: any;
}

class App extends React.Component<AppProps,{}>{
  
  render(){
	  let {appState,dispatch} = this.props;
	  let user = appState.user;
	  if(user!=null){
		  return (
				  <Main state={appState} dispatch={dispatch} pageBody={this.props.children} params={this.props.params}/>
				  );
	  }else{
		  return (
				  <Login state={appState} dispatch={dispatch}/>
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