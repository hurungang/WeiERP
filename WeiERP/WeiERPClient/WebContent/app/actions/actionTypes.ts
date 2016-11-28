
export interface Action<TPayload>{
	  type: string;
	  payload?: TPayload;
	  error?: boolean;
	  meta?: any;
	}

export interface IActionCreator<P> {
	  type: string;
	  (payload?: P): Action<P>;
}

export function actionCreator<P>(type: string): IActionCreator<P> {
  return (<any>Object).assign(
    (payload: P) => ({type, payload}),
    {type}
  );
}

export function isType<P>(action: Action<any>,
                          actionCreator: IActionCreator<P>): action is Action<P> {
  return action.type === actionCreator.type;
}

