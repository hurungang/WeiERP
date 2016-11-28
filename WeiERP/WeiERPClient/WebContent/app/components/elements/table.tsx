import * as React from 'react';
import {DataList} from '../../models/modelTypes'

interface TableProps {
	dataList:DataList<any>;
	idColumn: string;
	showLink?: boolean;
	clickCallBack?: (event:any)=>any;
}
export default class Table extends React.Component<TableProps,{}>{
  
  render(){
	let {dataList,idColumn,showLink=false} = this.props;
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
	idColumn: string;
	showLink: boolean;
	clickCallBack?: (event:any)=>any;
}
class TableRow extends React.Component<TableRowProps,{}>{
	  
	  render(){
		let {header,rowData,idColumn,showLink,clickCallBack} = this.props;
	    return (

	              <tr className="even pointer">

	                <td className="a-center ">
	                  <div className="icheckbox_flat-green"><input type="checkbox" className="flat" name="table_records"/></div>
	                </td>
		              {Object.keys(header).map((key,index)=>{
		            	  if(key==idColumn&&showLink){
		            		  return <td key={`t_tr_td_${index}`}><a onClick={clickCallBack.bind(this)} data-row={rowData}>{rowData[key]}</a></td>
		            	  }else{
		            		  return <td key={`t_tr_td_${index}`}>{rowData[key]}</td>
		            	  }
		              })}
	              </tr>
	    );
	}}