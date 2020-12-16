import { setupTransferableMethodsOnWorker } from '../../lib';

let aBuffer;
let bBuffer;
let cBuffer;

export function incrementA(buffer) {
  buffer[0] += 1;
  aBuffer = buffer;
  return buffer;
}

export function incrementB(buffer) {
  buffer[0] += 1;
  bBuffer = buffer;
  return buffer;
}

export function incrementC(buffer) {
  buffer[0] += 1;
  cBuffer = buffer;
  return buffer;
}

export function aBufferLen() {
	return aBuffer.length;
}

export function bBufferLen() {
  return bBuffer.length;
}

export function cBufferLen() {
  return cBuffer.length;
}

export function throwError() {
	throw new Error('Error in transferable.worker.js');
}

setupTransferableMethodsOnWorker({
  incrementB: {
    fn: incrementB,
    pickTransferablesFromResult: (result) => [result.buffer]
  },
  incrementC: {
    fn: incrementC
  },
  throwError: {
    fn: throwError
  }
});
