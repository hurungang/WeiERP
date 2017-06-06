import * as React from 'react';
import { DataList, Order } from '../../models/modelTypes'

interface EditableSelectProps {
    name?: string;
    size?: number;
    optionList: Array<any>;
    valueName?: string;
    textName?: string;
    defaultValue?: string;
    className?: string;
    onChange?: any;
}
export default class EditableSelect extends React.Component<EditableSelectProps, {key:number}>{

    // handleSelectChange(event){
    //     let select = event.target;
    //     select.nextElementSibling.value=select.value;
    // }
    refs:{
        textInput: HTMLInputElement,
    }
    data: any;

    constructor(){
        super();
        this.state = {key:1}
    }

    handleChange(event){
        let {optionList, valueName, textName,} = this.props;
        this.data = optionList.find((element)=>{
            return element[valueName] == event.target.value;
        })
        this.props.onChange(event);
    }
    get value(){
        return this.refs.textInput.value;
    }
    remount(){
        this.data = null;
        this.setState({key: Date.now()});
    }
    render() {
        let { size = 20, name, optionList, valueName, textName, defaultValue, className, onChange } = this.props;
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
                <input key={this.state.key} list={`${name}_list`} ref="textInput" name={name} size={size} defaultValue={defaultValue} className={className} onChange={this.handleChange.bind(this)} />
                <datalist id={`${name}_list`}>
                    {optionList.map((option, index) => {
                        return <option key={index} value={option[valueName]}>{option[textName]}</option>;
                    })}
                </datalist>
            </div>
        );
    }
}
