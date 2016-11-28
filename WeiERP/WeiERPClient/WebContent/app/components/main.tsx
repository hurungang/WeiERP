import * as React from 'react';
import {State} from '../reducers/reducerTypes';
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
  
  render(){
	  let {state,dispatch,params} = this.props;
	  let {user,isSmallMenuMode} = state.appState;
	  let smallMenuCSSIndicator = isSmallMenuMode?"nav-sm":"nav-md";
	  return (
		      <div className={`main_container ${smallMenuCSSIndicator}`}>
		      	{/*<!-- left column*/}
		      	<LeftColumn user={user} isSmallMenuMode={isSmallMenuMode} navTitle="Vedaleon Admin"/>
		        {/*left column -->*/}
		        
		        {/*<!-- top navigation*/}
		        <TopNavigation state={state} dispatch={dispatch}/>
		        {/*top navigation -->*/}
		        
		        {/*<!-- page content*/}
		        <div className="right_col" role="main">
		        	{React.cloneElement(this.props.pageBody,{dispatch:dispatch, state:state, params:params})}
	        	</div>
		        {/*page content -->*/}
		
		        {/*<!-- footer content*/}
		        <Footer footerText="Powered by Vedaleon technology"/>
		        {/*footer content -->*/}
		        
		      </div>
			  );
}}