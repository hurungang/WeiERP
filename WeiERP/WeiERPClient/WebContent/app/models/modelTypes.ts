
export interface User { 
	id?: number; 
	name: string;
	password?: string;
}

export interface Menu { 
	id: number; 
	text: string;
	link: string;
	icon: string;
	subMenus?: Menu[];
}

export interface Order {
	id?: number;
	consigneeName: string;
	consigneeAddress: string;
}

export interface DataList<T> {
	header: any;
	data: T[];
}

export interface Error {
	errorCode: string;
	errorDetail?: string;
}