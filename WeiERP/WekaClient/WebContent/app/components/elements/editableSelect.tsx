import * as React from 'react';
import {DataList,Order} from '../../models/modelTypes'

interface EditableSelectProps {
    name: string;
    size?: number;
    optionList: Array<any>;
    valueName: string;
    textName: string;
    defaultValue?: string;
}
export default class EditableSelect extends React.Component<EditableSelectProps,{}>{
    
    handleSelectChange(event){
        let select = event.target;
        select.nextElementSibling.value=select.value;
    }
    
  render(){
	let {size=20,name,optionList,valueName,textName,defaultValue} = this.props;
    return (
// non-html5 implementation
//        <div style={{position:"relative",width:width,fontSize:"14px",}}>
//            <select onChange={this.handleSelectChange.bind(this)} style={{position:"absolute",top:"0px",left:"0px",width:width}}>
//            {optionList.map((option,index)=>{
//                return <option key={index} value={option[valueName]}>{option[textName]}</option>;
//                })}
//            </select>
//            <input type="text" name={name} value="" style={{position:"absolute",top:"0px",left:"0px",width:width-20,fontSize:"12px",}}/>
//        </div>
         <div>
            <input list={`${name}_list`} name={name} size={size} placeholder={defaultValue}/>
            <datalist id={`${name}_list`}>
            {optionList.map((option,index)=>{
                return <option key={index} value={option[valueName]}>{option[textName]}</option>;
                })}
            </datalist>         
        </div>
    );
}}
