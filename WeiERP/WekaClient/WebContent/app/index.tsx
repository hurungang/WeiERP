import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/app'
import reducers from './reducers/index';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
//import createLogger from 'redux-logger'
import {Router, Route, IndexRoute, hashHistory, browserHistory} from 'react-router';
import Dashboard from './components/dashboard/dashboard'
import OrderPage from './components/order/order'

//const loggerMiddleware = createLogger();
const appStore = createStore(reducers,applyMiddleware(thunkMiddleware));

ReactDOM.render(
  <Provider store={appStore}>
  	<Router history={hashHistory}>
  		<Route path="/" component={App}>
			  <IndexRoute component={Dashboard}/>
  			<Route path="/order" component={OrderPage}/>
  			<Route path="/order/:id" component={OrderPage}/>
  		</Route>
  	</Router>
  </Provider>
  , document.querySelector('#container'));
