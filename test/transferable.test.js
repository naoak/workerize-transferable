import Worker from 'workerize-loader?ready&name=test!./fixtures/transferable.worker';
import { setupTransferableMethodsOnMain } from '../lib';

describe('worker', () => {
  describe('setupTransferableMethodsOnMain() on main, setupTransferableMethodsOnWorker() on worker', () => {
    it('should transfer the buffer ownerships (A [clone, clone], B [transfer, transfer], C [transfer, clone])', async () => {
      const worker = Worker();
      setupTransferableMethodsOnMain(worker, {
        incrementB: {
          pickTransferablesFromParams: (params) => [
            params[0].buffer
          ]
        },
        incrementC: {
          pickTransferablesFromParams: (params) => [
            params[0].buffer
          ]
        }
      });

      // A's buffers: Clone only
      let array = new Int32Array([0]);
      const aRes = await worker.incrementA(array);
      expect(array.length).toEqual(1);
      expect(array[0]).toEqual(0);
      expect(aRes.length).toEqual(1);
      expect(aRes[0]).toEqual(1);
      expect(await worker.aBufferLen()).toEqual(1);

      // B's buffers: Both transferable
      array = new Int32Array([0]);
      const bRes = await worker.incrementB(array);
      expect(array.length).toEqual(0); // lost the ownership
      expect(bRes.length).toEqual(1);
      expect(bRes[0]).toEqual(1);
      expect(await worker.bBufferLen()).toEqual(0); // lost the ownership

      // C's buffer: One is a transferable (main -> worker) and the other is a clone (main <- worker)
      array = new Int32Array([0]);
      const cRes = await worker.incrementC(array);
      expect(array.length).toEqual(0); // lost the ownership
      expect(cRes.length).toEqual(1);
      expect(cRes[0]).toEqual(1);
      expect(await worker.cBufferLen()).toEqual(1); // keep the ownership
    });

    it('should transfer the buffer ownerships (A [clone, clone], B [clone, transfer], C [clone, clone]', async () => {
      const worker = Worker();
      setupTransferableMethodsOnMain(worker, {
        incrementB: {},
        incrementC: {}
      });

      // A's buffers: Clone only
      let array = new Int32Array([0]);
      const aRes = await worker.incrementA(array);
      expect(array.length).toEqual(1);
      expect(array[0]).toEqual(0);
      expect(aRes.length).toEqual(1);
      expect(aRes[0]).toEqual(1);
      expect(await worker.aBufferLen()).toEqual(1);

      // B's buffers: One is a clone (main -> worker) and the other is a transferable (main <- worker)
      array = new Int32Array([0]);
      const bRes = await worker.incrementB(array);
      expect(array.length).toEqual(1); // keep the ownership
      expect(array[0]).toEqual(0);
      expect(bRes.length).toEqual(1);
      expect(bRes[0]).toEqual(1);
      expect(await worker.bBufferLen()).toEqual(0); // lost the ownership

      // C's buffers: Clone only
      array = new Int32Array([0]);
      const cRes = await worker.incrementC(array);
      expect(array.length).toEqual(1); // keep the ownership
      expect(array[0]).toEqual(0);
      expect(cRes.length).toEqual(1);
      expect(cRes[0]).toEqual(1);
      expect(await worker.cBufferLen()).toEqual(1); // keep ther ownership
    });
  });

  describe('errors', () => {
    it('worker.throwError() should pass the Error back to the application context', async () => {
      const worker = Worker();
      setupTransferableMethodsOnMain(worker, {
        throwError: {}
      });
      try {
        await worker.throwError();
      }
      catch (e) {
        expect(e).toEqual(Error('Error in transferable.worker.js'));
      }
    });

    it('worker.throwError() should pass the Error back to the application context', async () => {
      const worker = Worker();
      setupTransferableMethodsOnMain(worker, {
        throwError: {}
      });
      try {
        await worker.throwError();
      }
      catch (e) {
        expect(e).toEqual(Error('Error in transferable.worker.js'));
      }
    });
  });
});

