import * as React from 'react';
import InputGroup from "./inputGroup";
import Table from "../elements/table";
import { Paginator, DataList, Language, TableAction, TableHeader, Workbook } from "../../models/modelTypes";
import DataUtils from "../../utils/dataUtils";
import LabeledSelect from "./labeledSelect";
//import * as alasql from 'alasql'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'

interface PagedTableProps {
    dataList: any[],
    header: TableHeader
    idColumn: string,
    defaultEntriesPerPage: number,
    onDataRowClick: any,
    language: Language,
    actions: TableAction,
    exportHeader?: TableHeader,
}

interface PagedTableState {
    keyword: string;
    paginator: Paginator;
    sortBy: string,
    sortDesc: boolean,
    selectedItems: any[],
}
export default class PagedTable extends React.Component<PagedTableProps, PagedTableState>{
    readonly SwayRange = 3;
    constructor() {
        super();
        this.state = {
            keyword: "",
            paginator: new Paginator(1, 10),
            sortBy: "createTime",
            sortDesc: true,
            selectedItems: [],
        };
    }

    handleKeywordChange(event: any) {
        let keyword = event.target.value;
        let newState = { ...this.state, keyword: keyword }
        console.log(newState);
        this.setState(newState);
    }

    handlePageChange(currentPage: number) {
        let { paginator } = this.state;
        paginator.currentPage = currentPage ? currentPage : 1;
        let newState = { ...this.state, paginator: paginator }
        this.setState(newState);
    }

    handleShowEntriesChange(event: any) {
        let entriesPerPage = event.target.value;
        let { paginator } = this.state;
        paginator.entriesPerPage = entriesPerPage ? parseInt(entriesPerPage) : 1;
        let newState = { ...this.state, paginator: paginator };
        this.setState(newState);
    }

    handleTableChange() {
        let { dataList } = this.props;
        let { selectedItems } = this.state;
        selectedItems = dataList.filter((item) => item.selected);
        let newState = { ...this.state, selectedItems: selectedItems };
        this.setState(newState);
    }
    handleExport(dataList:any[]) {
        let fileName = Date.now();
        let { exportHeader } = this.props;
        let plainDataList = DataUtils.buildExportData(dataList,exportHeader);
        //let res = alasql('SELECT * INTO XLSX("' + fileName + '.xlsx",{headers:true}) FROM ?', [plainDataList]);
        /* bookType can be any supported output type */
        var wopts = { bookType:'xlsx' as XLSX.BookType, bookSST:true, type:"binary" as "binary"  };
        let workbook = new Workbook();
        workbook.SheetNames.push("test");
        let worksheet = XLSX.utils.json_to_sheet(plainDataList);
        workbook.Sheets["test"] = worksheet;
        var wbout = XLSX.write(workbook,wopts);

        function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
        }

        /* the saveAs call downloads a file on the local machine */
        FileSaver.saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "test.xlsx");
    }

    render() {
        let { dataList, header, idColumn, defaultEntriesPerPage, onDataRowClick, language, actions } = this.props;
        let { paginator, keyword, selectedItems } = this.state;

        let filterDataList = dataList ? DataUtils.filterByKeyword(dataList, this.state.keyword) : null;
        filterDataList = DataUtils.sort(filterDataList, this.state.sortBy, this.state.sortDesc);

        paginator.init(filterDataList);

        return (
            <div id="datatable-responsive_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                <div className="row">
                    <div className="col-xs-7">
                        {
                            (actions && selectedItems && selectedItems.length > 0) ?
                                //when some rows selected
                                <div className="btn-group">
                                    <button type="button" className="btn btn-success">
                                        <i className="fa fa-cubes"></i> {language.textPackage.button.bulkAction}</button>
                                    <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                        <span className="caret"></span>
                                    </button>
                                    <ul className="dropdown-menu" role="menu">
                                        {
                                            actions.bulkActions.map((bulkActionGroup, index) => {
                                                return Object.keys(bulkActionGroup).map((key, index2) => {
                                                    if (index2 == 0) {
                                                        return <li key={index + "_" + index2} className="text-divider">{key}</li>
                                                    } else {
                                                        return <li key={index + "_" + index2}><a onClick={bulkActionGroup[key] ? bulkActionGroup[key].bind(this, selectedItems) : null}>{key}</a></li>

                                                    }
                                                })
                                            })
                                        }
                                    </ul>
                                </div>
                                :
                                //when now rows selected
                                <button type="button" className="btn btn-success" onClick={actions.createAction.bind(this)}>
                                    <i className="fa fa-plus"></i> {language.textPackage.button.create}</button>
                        }
                    </div>
                    <div className="col-xs-5">
                        <InputGroup iconClass="fa fa-search" containerClass="col-xs-9" onChange={this.handleKeywordChange.bind(this)} />
                        <div className="col-xs-3"><button type="button" className="btn btn-success" onClick={this.handleExport.bind(this,filterDataList)}>
                                    <i className="fa fa-file-excel-o"></i> {language.textPackage.button.export}</button></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <Table list={paginator.slice} header={header} idColumn="id" onChange={this.handleTableChange.bind(this)} onDataRowClick={onDataRowClick.bind(this)} />
                    </div>
                </div>
                <div className="row form-horizontal form-label-left">
                    <LabeledSelect label={language.textPackage.paginator.entriesPerPage} onChange={this.handleShowEntriesChange.bind(this)} optionArray={language.textPackage.paginator.entriesSelectArray} containerClass="col-xs-3" selectContainerClass="col-xs-6" labelClass="col-xs-6" defaultValue={language.textPackage.order.defaultEntriesPerPage} />
                    <div className="col-xs-2">
                        <div className="dataTables_info">
                            {language.textPackage.paginator.pageRange.format(paginator.start, paginator.end, paginator.totalRecords)}
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <div className="dataTables_paginate paging_simple_numbers">
                            <ul className="pagination">
                                <li className={`paginate_button previous ${paginator.disablePrevious ? "disabled" : ""}`}>
                                    <a data-dt-idx="0" onClick={paginator.disablePrevious ? null : this.handlePageChange.bind(this, paginator.currentPage + 1)}>&lt;</a></li>
                                {paginator.map((page) => {
                                    let leftPage = paginator.currentPage - this.SwayRange;
                                    let rightPage = paginator.currentPage + this.SwayRange;
                                    if (leftPage < 2) {
                                        leftPage = 2;
                                        rightPage = leftPage + 2 * this.SwayRange;
                                    } else if (rightPage > paginator.totalPages - 1) {
                                        rightPage = paginator.totalPages - 1;
                                        leftPage = rightPage - 2 * this.SwayRange;
                                    }

                                    if ((page > 2 && page == leftPage) || (page < paginator.totalPages - 1 && page == rightPage)) {
                                        return <li key={page} className='paginate_button'><a>...</a></li>
                                    } else if (page <= 2 || page >= paginator.totalPages - 1 || (page > leftPage && page < rightPage)) {
                                        return <li key={page} className={paginator.currentPage == page ? 'paginate_button active' : 'paginate_button'}><a onClick={this.handlePageChange.bind(this, page)}>{page}</a></li>
                                    }
                                })}
                                <li className={`paginate_button next ${paginator.disableNext ? "disabled" : ""}`}><a onClick={paginator.disableNext ? null : this.handlePageChange.bind(this, paginator.currentPage + 1)}>&gt;</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}