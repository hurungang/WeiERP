import * as React from 'react';

interface InputGroupProps {
    iconClass?:string;
    containerClass?:string;
    inputName?: string;
    defaultValue?: string;
    onChange?: any;
    value?: any;
}
export default class InputGroup extends React.Component<InputGroupProps,{}>{
  
  render(){
	let {iconClass,inputName,defaultValue,onChange,containerClass,value} = this.props;
    
    return (
        <div className={`input-group ${containerClass}`}>
            <span className="add-on input-group-addon"><i className={iconClass}></i></span>
            <input type="text" name={inputName} className="form-control" defaultValue={defaultValue} value={value} onChange={onChange?onChange.bind(this):null}/>
        </div>
    );
}}