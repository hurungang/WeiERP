import * as React from 'react';
import { Paginator, Language, DataList, TableAction,Order } from "../../models/modelTypes";
import XTitle from "../elements/xtitle";
import * as DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import * as moment from 'moment';
import * as dateFormater from 'dateformat'
import LabeledSelect from "../elements/labeledSelect";
import InputGroup from "../elements/inputGroup";
import Table from "../elements/table";
import PagedTable from "../elements/pagedTable";

interface OrderListProps {
    language: Language;
    onOrderRowClick?: any;
    orderList: DataList<Order>;
    actions: TableAction;
}

interface OrderListState {
    startDate: moment.Moment,
    endDate: moment.Moment,
    orderStatus: string,
}

export default class OrderList extends React.Component<OrderListProps, OrderListState>{
    constructor() {
        super();
        this.state = {
            startDate: moment().subtract(29, 'days'),
            endDate: moment(),
            orderStatus: null,
        };
    }


    handleFilterOrderStatusChange(event: any) {
        let orderStatus = event.target.value;
        if(orderStatus==this.props.language.textPackage.order.emptyHeader){
            orderStatus = null;
        }
        let newState = { ...this.state, orderStatus: orderStatus };
        this.setState(newState);
    }

    handleDateRangeChange(event, picker) {
        console.log(picker.startDate);
        let newState = {
            ...this.state,
            startDate: picker.startDate,
            endDate: picker.endDate
        };
        this.setState(newState);
    }

    handlRefresh(){
        this.forceUpdate();
    }

    render() {
        let { language, orderList, onOrderRowClick,actions} = this.props;
        let { startDate, endDate, orderStatus } = this.state;
        let textPackage = language.textPackage;
        let selectedDateRangeString: string = textPackage.timeRangeFormat.format(dateFormater(startDate, language.timeFormat), dateFormater(endDate, language.timeFormat));
        let ranges= {
                [textPackage.predefinedRange.today]: [moment().startOf('day'), moment().endOf('day')],
                [textPackage.predefinedRange.yesterday]: [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                [textPackage.predefinedRange.last7Days]: [moment().subtract(6, 'days').startOf('day'), moment()],
                [textPackage.predefinedRange.last30Days]: [moment().subtract(29, 'days').startOf('day'), moment()],
                [textPackage.predefinedRange.thisMonth]: [moment().startOf('month'), moment().endOf('month')],
                [textPackage.predefinedRange.lastMonth]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            }

        let filterOrderList = orderList.data.filter((order) => {
            return ((!orderStatus || order.status === orderStatus) && startDate.isSameOrBefore(order.createTime) && endDate.isSameOrAfter(order.createTime));
        })

        return (


            <div className="col-xs-12">
                <div className="x_panel">
                    <XTitle title={textPackage.orderListTitle} smallTitle={orderStatus} />
                    <div className="x_content">
                        <div className="well row form-horizontal form-label-left">
                            <DatetimeRangePicker
                                timePicker
                                timePicker24Hour
                                showDropdowns
                                timePickerSeconds={false}
                                locale={textPackage.timeRangePicker}
                                startDate={startDate}
                                endDate={endDate}
                                onApply={this.handleDateRangeChange.bind(this)}
                                className="col-xs-6"
                                ranges={ranges}
                            >
                                <InputGroup iconClass="fa fa-calendar" value={selectedDateRangeString} />
                            </DatetimeRangePicker>
                            <LabeledSelect
                                containerClass="col-xs-3" labelClass="col-xs-4" selectContainerClass="col-xs-8"
                                label={textPackage.order.status}
                                onChange={this.handleFilterOrderStatusChange.bind(this)}
                                optionObject={textPackage.order.statuses} emptyHeader={textPackage.order.emptyHeader}/>
                            <div className="col-xs-3">
                            <button type="button" className="btn btn-success" onClick={this.handlRefresh.bind(this)}>
                                    <i className="fa fa-refresh"></i> {language.textPackage.button.refresh}</button>
                            </div>
                        </div>
                        <PagedTable
                            dataList={filterOrderList}
                            header={textPackage.orderHeader}
                            exportHeader={textPackage.orderExportHeader}
                            idColumn={textPackage.order.idColumn}
                            defaultEntriesPerPage={textPackage.order.defaultEntriesPerPage}
                            onDataRowClick={onOrderRowClick.bind(this)}
                            language={language} actions={actions}/>
                    </div>
                </div>
            </div>
        );
    }
}