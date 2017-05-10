import * as React from 'react';

interface LabeledSelectProps {
    containerClass?:string;
    labelClass?:string;
    selectContainerClass?:string;
    inputName?: string;
    onChange?: any;
    label?: string;
    options?: {name:string,value:string}[];
}
export default class LabeledSelect extends React.Component<LabeledSelectProps,{}>{
  
  render(){
	let {containerClass,inputName,onChange,options,label} = this.props;
    
    return (
            <div className={`form-group ${containerClass}`}>
                <label className={`control-label ${containerClass}`}>{label}</label> 
                <div className={`${containerClass}`}>
                    <select className="form-control" onChange={onChange.bind(this)}>
                        {options.map((option,index)=>{
                            return <option key={index} value={option.value}>{option.name}</option>
                        })}
                    </select>
                </div>
            </div>
    );
}}