import * as React from 'react';
import * as dateFormater from 'dateformat'
import { DataList, Order, TableHeader, ComputedColumn } from '../../models/modelTypes'


interface TableProps {
	header:TableHeader;
	list:any[];
	idColumn?: string;
	onDataRowClick?: (rowData:any)=>any;
	onChange?: ()=>any;
}

export default class Table extends React.Component<TableProps,{}>{

  handleChange(){
		let {list} = this.props;
		this.props.onChange();
	}

	selectAll(event:any){
		let {list} = this.props;
		list.map((item)=>item.selected=event.target.checked);
		this.props.onChange();
		this.forceUpdate();
	}

  render(){
	let {list,header,idColumn,onDataRowClick} = this.props;
	let checkAll = list.find((item)=>!item.selected)?false:true;
    return (
    		<table className="table table-striped table-bordered dt-responsive nowrap">
            <thead>
              <tr className="headings">
                <th>
                  <div className="icheckbox_flat-green"><input type="checkbox" checked={checkAll} className="flat" onChange={this.selectAll.bind(this)}/></div>
                </th>
              {Object.keys(header).map((key,index)=>{
								let headerText = header[key];
								if(typeof header[key]==="object"){
									headerText = (header[key] as ComputedColumn).label;
								}
            	  return <th className="column-title" key={`t_th_${index}`}>{headerText}</th>;
              })}
              </tr>
            </thead>

            <tbody>
              {list.map((data,index)=>{
            	  return (
            			  <TableRow header={header} rowData={data} key={`t_tr_${index}`} idColumn={idColumn} onDataRowClick={onDataRowClick} onChange={this.handleChange.bind(this)}/>
            	  )
              })}
            </tbody>
          </table>
    );
}}

interface TableRowProps {
	header:TableHeader;
	rowData:any;
	idColumn?: string;
	onDataRowClick?: (rowData:any)=>any;
	onChange: ()=>any;
}
class TableRow extends React.Component<TableRowProps,{}>{
	  
		handleSelected(event: any){
			let {rowData} = this.props;
			rowData.selected = event.target.checked;
			this.props.onChange();
		}

	  render(){
		let {header,rowData,idColumn,onDataRowClick} = this.props;
	    return (

	              <tr className="even cell">

	                <td className="a-center ">
	                  <div className="icheckbox_flat-green"><input type="checkbox" className="flat" checked={rowData.selected?true:false} onChange={this.handleSelected.bind(this)}/></div>
	                </td>
		              {Object.keys(header).map((key,index)=>{
										
										let fieldValue = rowData[key];
										if(typeof header[key]==="object"){
											fieldValue = (header[key] as ComputedColumn).callback(fieldValue);
										}
		            	  if(key==idColumn){
		            		  return <td key={`t_tr_td_${index}`} className="pointer" onClick={onDataRowClick.bind(null,rowData)}><a><b>{fieldValue}</b></a></td>
		            	  }else{
		            		  return <td key={`t_tr_td_${index}`} className="pointer" onClick={onDataRowClick.bind(null,rowData)}>{fieldValue}</td>
		            	  }
		              })}
	              </tr>
	    );
	}}