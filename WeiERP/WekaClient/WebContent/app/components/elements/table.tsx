import * as React from 'react';
import {DataList,Order} from '../../models/modelTypes'

interface TableProps {
	dataList:DataList<any>;
	idColumn?: string;
	clickCallBack?: (rowData:any)=>any;
}
export default class Table extends React.Component<TableProps,{}>{
  
  render(){
	let {dataList,idColumn} = this.props;
    return (
    		<table className="table table-striped jambo_table bulk_action">
            <thead>
              <tr className="headings">
                <th>
                  <div className="icheckbox_flat-green"><input type="checkbox" id="check-all" className="flat"/></div>
                </th>
              {Object.keys(dataList.header).map((key,index)=>{
            	  return <th className="column-title" key={`t_th_${index}`}>{dataList.header[key]}</th>
              })}
              </tr>
            </thead>

            <tbody>
              {dataList.data.map((data,index)=>{
            	  return (
            			  <TableRow header={dataList.header} rowData={data} key={`t_tr_${index}`} {...this.props}/>
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
	clickCallBack?: (rowData:any)=>any;
}
class TableRow extends React.Component<TableRowProps,{}>{
	  
	  render(){
		let {header,rowData,idColumn,clickCallBack} = this.props;
	    return (

	              <tr className="even cell" onClick={clickCallBack.bind(null,rowData)}>

	                <td className="a-center ">
	                  <div className="icheckbox_flat-green"><input type="checkbox" className="flat" name="table_records"/></div>
	                </td>
		              {Object.keys(header).map((key,index)=>{
		            	  if(key==idColumn){
		            		  return <td key={`t_tr_td_${index}`}><b>{rowData[key]}</b></td>
		            	  }else{
		            		  return <td key={`t_tr_td_${index}`}>{rowData[key]}</td>
		            	  }
		              })}
	              </tr>
	    );
	}}