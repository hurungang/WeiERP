import * as React from 'react';

interface InputGroupProps {
    iconClass?:string;
    containerClass?:string;
    inputName?: string;
    defaultValue?: string;
    onChange?: any;
}
export default class InputGroup extends React.Component<InputGroupProps,{}>{
  
  render(){
	let {iconClass,inputName,defaultValue,onChange,containerClass} = this.props;
    
    return (
        <div className={`input-group ${containerClass}`}>
            <span className="add-on input-group-addon"><i className={iconClass}></i></span>
            <input type="text" name={inputName} className="form-control" defaultValue={defaultValue} onChange={onChange?onChange.bind(this):null}/>
        </div>
    );
}}