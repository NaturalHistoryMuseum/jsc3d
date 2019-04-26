/**
 * @preserve Copyright (c) 2011~2014 Humu <humu2009@gmail.com>
 * This file is part of jsc3d project, which is freely distributable under the
 * terms of the MIT license.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const hasDocument = typeof document !== 'undefined';

var info = {
  browser:			hasDocument ? 'other' : false,
  version:			'n/a',
  isTouchDevice:		(hasDocument && document.createTouch != undefined), 		// detect if it is running on touch device
  supportTypedArrays:	(typeof Uint32Array === 'function'),			// see if Typed Arrays are supported
  supportWebGL:		(typeof WebGLRenderingContext != 'undefined')	// see if WebGL context is supported
};

var agents = [
  ['firefox', /Firefox[\/\s](\d+(?:\.\d+)*)/],
  ['chrome',  /Chrome[\/\s](\d+(?:\.\d+)*)/ ],
  ['opera',   /Opera[\/\s](\d+(?:\.\d+)*)/],
  ['safari',  /Safari[\/\s](\d+(?:\.\d+)*)/],
  ['webkit',  /AppleWebKit[\/\s](\d+(?:\.\d+)*)/],
  ['ie',      /MSIE[\/\s](\d+(?:\.\d+)*)/],
  /*
    * For IE11 and above, as the old keyword 'MSIE' no longer exists there.
    * By Laurent Piroelle <laurent.piroelle@fabzat.com>.
    */
  ['ie',      /Trident\/\d+\.\d+;\s.*rv:(\d+(?:\.\d+)*)/]
];

var matches;
for(var i=0; i<agents.length; i++) {
  if(hasDocument && (matches = agents[i][1].exec(window.navigator.userAgent))) {
    info.browser = agents[i][0];
    info.version = matches[1];
    break;
  }
}

export default info;
