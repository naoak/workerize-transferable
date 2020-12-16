import { getGlobalThis, isTransferableObject } from '../lib/util';

const nextFrame = () => new Promise(r => window.requestAnimationFrame(r));

describe('util', () => {
  describe('getGlobalThis()', () => {
    it('should get the global scope', async () => {
      // must be the window
      const globals = getGlobalThis();
      expect(globals).not.toBeFalsy();
      expect(globals.postMessage).not.toBeFalsy();
    });
  });

  describe('isTransferableObject()', () => {
    it('should judge if an object is transferable or not', async () => {
      const src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
      document.body.innerHTML = `<div><img id="img" witdh="1px" height="1px" src="${src}" /><canvas id="canvas"></canvas></div>`;
      await nextFrame();
      const img = document.getElementById('img');
      const canvas = document.getElementById('canvas');
      const fn = isTransferableObject;
      expect(fn(undefined)).toEqual(false);
      expect(fn(null)).toEqual(false);
      expect(fn(0)).toEqual(false);
      expect(fn([0, 1, 2])).toEqual(false);
      expect(fn(new Int32Array([0]))).toEqual(false);
      expect(fn(new Int32Array([0]).buffer)).toEqual(true);
      expect(fn(new MessageChannel().port1)).toEqual(true);
      expect(fn(await createImageBitmap(img, 0, 0, 1, 1))).toEqual(true);
      expect(fn(canvas.transferControlToOffscreen())).toEqual(true);
    });
  });
});