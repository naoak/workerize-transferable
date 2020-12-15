import { MESSAGE_TYPE_RPC_TRANSFERABLE } from './message-types';

/** Options for worker method result */
export type WorkerMethodResultOptions = {
  /** worker method */
  fn: (...params: any[]) => any;

  /** pick transferables from method result */
  pickTransferablesFromResult: (result: any) => any[];
};

/**
 * Setup worker methods which return transferables. This function should be executed on the worker thread.
 * @param methods an object whose key is method name and whose value is options how to pick transferables from method result
 */
export function setupTransferableMethodsOnWorker(methods: {
  [x: string]: WorkerMethodResultOptions;
}) {
  globalThis.addEventListener('message', e => {
    const { type, method, id, params } = e.data;
    let opts: WorkerMethodResultOptions;
    let p: Promise<any>;
    if (type === MESSAGE_TYPE_RPC_TRANSFERABLE && method) {
      if ((opts = methods[method])) {
        p = Promise.resolve().then(() => opts.fn(...params));
      } else {
        p = Promise.reject('No such method');
      }
      p.then(result => {
        globalThis.postMessage(
          { type: MESSAGE_TYPE_RPC_TRANSFERABLE, id, result },
          opts.pickTransferablesFromResult ? opts.pickTransferablesFromResult(result) : []
        );
      }).catch(e => {
        const error: any = { message: e };
        if (e.stack) {
          error.message = e.message;
          error.stack = e.stack;
          error.name = e.name;
        }
        globalThis.postMessage({
          type: MESSAGE_TYPE_RPC_TRANSFERABLE,
          id,
          error
        });
      });
    }
  });
}
