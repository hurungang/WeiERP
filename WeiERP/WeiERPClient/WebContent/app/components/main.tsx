import * as React from 'react';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {State} from '../reducers/reducerTypes';
import {Localization} from '../models/modelTypes';
import Footer from './layout/footer';
import LeftColumn from './layout/leftColumn';
import TopNavigation from './layout/topNavigation';
import PageContent from './layout/pageContent';

interface MainProps {
	state: State;
	dispatch: any;
	pageBody: React.ReactElement<any>;
	params: any;
}

export default class Main extends React.Component<MainProps,{}>{
  
	renderPageBody(){
	  let {state,dispatch,params} = this.props;
	  let {isAppProceeding} = state.appState;
	  if(isAppProceeding){
	    return <div className="right_col loader" role="main">Loading ... </div>
	  }else{
	    return (
	    <div className="right_col" role="main">
        	{React.cloneElement(this.props.pageBody,{dispatch:dispatch, state:state, params:params})}
    	</div>
    	)
	  }
	}
	
	render(){
	  let {state,dispatch,params} = this.props;
	  let {user,isSmallMenuMode} = state.appState;
    let appText:Localization = state.appState.getText();
	  let smallMenuCSSIndicator = isSmallMenuMode?"nav-sm":"nav-md";
	  return (
		      <div className={`main_container ${smallMenuCSSIndicator}`}>
		      	{/*<!-- left column*/}
		      	<LeftColumn user={user} isSmallMenuMode={isSmallMenuMode} navTitle={appText.applicationName}/>
		        {/*left column -->*/}
		        
		        {/*<!-- top navigation*/}
		        <TopNavigation state={state} dispatch={dispatch}/>
		        {/*top navigation -->*/}
		        
		        {/*<!-- page content*/}
		        <ReactCSSTransitionGroup
	            transitionName="pageBodyTransition"
	                transitionEnterTimeout={500}
	                transitionLeaveTimeout={300}>
		        	{this.renderPageBody()}
		        </ReactCSSTransitionGroup>
		        {/*page content -->*/}
		
		        {/*<!-- footer content*/}
		        <Footer footerText="Powered by Vedaleon technology"/>
		        {/*footer content -->*/}
		        
		      </div>
			  );
	}
}