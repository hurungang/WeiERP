import appReducers from '../../app/reducers/appReducers'
import {INITIAL_APP_STATE} from '../../app/reducers/appReducers'
import {
  APP_TOGGLE_MENU, 
  APP_LOGIN, 
  APP_PROCEEDING,
  APP_PROCEEDING_END,
  APP_CHANGE_LANGUAGE,
  } from '../../app/actions/appActions'
import {AppState} from '../../app/reducers/reducerTypes';
import {User} from '../../app/models/modelTypes';
import * as chai from 'chai'
import * as mocha from 'mocha'


describe("App Reducers",()=>{

  it("TOGGLE_MENU",()=>{
    chai.assert.strictEqual(INITIAL_APP_STATE.isSmallMenuMode,false);
    let newState:AppState = appReducers(INITIAL_APP_STATE,APP_TOGGLE_MENU);
    chai.assert.strictEqual(newState.isSmallMenuMode,true);
  })
  
  it("CHANGE_LANGUAGE",()=>{
    let language = "Chinese";
    let newState:AppState = appReducers(INITIAL_APP_STATE,APP_CHANGE_LANGUAGE(language));
    chai.assert.strictEqual(newState.language,language);
  })
  it("APP_LOGIN",()=>{
    chai.assert.strictEqual(INITIAL_APP_STATE.isSmallMenuMode,false);
    let user:User = new User();
    user.id = "1";
    let newState:AppState = appReducers(INITIAL_APP_STATE,APP_LOGIN(user));
    chai.assert.strictEqual(newState.user,user);
  })
  
  it("APP_PROCEEDING",()=>{
    chai.assert.strictEqual(INITIAL_APP_STATE.isAppProceeding,false);
    let newState:AppState = appReducers(INITIAL_APP_STATE,APP_PROCEEDING());
    chai.assert.strictEqual(newState.isAppProceeding,true);
    newState = appReducers(INITIAL_APP_STATE,APP_PROCEEDING_END());
    chai.assert.strictEqual(newState.isAppProceeding,false);
  })
  
})
