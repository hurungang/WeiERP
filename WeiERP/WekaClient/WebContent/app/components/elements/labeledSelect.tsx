import * as React from 'react';
import { Option } from "../../models/modelTypes";

interface LabeledSelectProps {
    containerClass?:string;
    labelClass?:string;
    selectContainerClass?:string;
    inputName?: string;
    onChange?: any;
    label?: string;
    optionArray?: Option[];
    optionObject?: {};
    emptyHeader?: string;
    defaultValue?: any;
}
export default class LabeledSelect extends React.Component<LabeledSelectProps,{}>{
  
  render(){
	let {containerClass,labelClass,selectContainerClass,inputName,onChange,optionArray,optionObject,label,emptyHeader,defaultValue} = this.props;
    let optionJSX;
    if(optionArray){
        optionJSX = optionArray.map((option,index)=>{
                            return <option key={index} value={option.value}>{option.name}</option>
                        })
    }
    if(optionObject){
        optionJSX = Object.keys(optionObject).map((key,index)=>{
                            return <option key={index} value={key}>{optionObject[key]}</option>
                        })
    }
    return (
            <div className={`form-group ${containerClass}`}>
                <label className={`control-label ${labelClass}`}>{label}</label> 
                <div className={`${selectContainerClass}`}>
                    <select className="form-control" onChange={onChange.bind(this)} defaultValue={defaultValue}>
                        {emptyHeader?<option>{emptyHeader}</option>:""}
                        {optionJSX}
                    </select>
                </div>
            </div>
    );
}}