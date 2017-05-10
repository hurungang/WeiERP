import * as React from 'react';
import * as dateFormater from 'dateformat'
import {DataList,Order} from '../../models/modelTypes'


interface TableProps {
	header:any;
	list:any[];
	idColumn?: string;
	dateFormat:string;
	clickCallBack?: (rowData:any)=>any;
}
export default class Table extends React.Component<TableProps,{}>{
  
  render(){
	let {list,header,idColumn} = this.props;
    return (
    		<table className="table table-striped table-bordered dt-responsive nowrap">
            <thead>
              <tr className="headings">
                <th>
                  <div className="icheckbox_flat-green"><input type="checkbox" id="check-all" className="flat"/></div>
                </th>
              {Object.keys(header).map((key,index)=>{
            	  return <th className="column-title" key={`t_th_${index}`}>{header[key]}</th>
              })}
              </tr>
            </thead>

            <tbody>
              {list.map((data,index)=>{
            	  return (
            			  <TableRow header={header} rowData={data} key={`t_tr_${index}`} {...this.props}/>
            	  )
              })}
            </tbody>
          </table>
    );
}}

interface TableRowProps {
	header:any;
	rowData:any;
	idColumn?: string;
	dateFormat:string;
	clickCallBack?: (rowData:any)=>any;
}
class TableRow extends React.Component<TableRowProps,{}>{
	  
	  render(){
		let {header,rowData,idColumn,clickCallBack,dateFormat} = this.props;
	    return (

	              <tr className="even cell">

	                <td className="a-center ">
	                  <div className="icheckbox_flat-green"><input type="checkbox" className="flat" name="table_records"/></div>
	                </td>
		              {Object.keys(header).map((key,index)=>{
										let fieldValue = rowData[key];
										if(fieldValue instanceof  Date){
											fieldValue = dateFormater(fieldValue,dateFormat);
										}
		            	  if(key==idColumn){
		            		  return <td key={`t_tr_td_${index}`}><a onClick={clickCallBack.bind(null,rowData)}><b>{fieldValue}</b></a></td>
		            	  }else{
		            		  return <td key={`t_tr_td_${index}`}>{fieldValue}</td>
		            	  }
		              })}
	              </tr>
	    );
	}}