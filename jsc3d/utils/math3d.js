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

/**
	@class Math3D

	This class provides some utility methods for 3D mathematics.
 */
const Math3D = {

	/**
		Transform vectors using the given matrix.
		@param {JSC3D.Matrix3x4} mat the transformation matrix.
		@param {Array} vecs a batch of vectors to be transform.
		@param {Array} xfvecs where to output the transformed vetors.
	 */
	transformVectors: function(mat, vecs, xfvecs) {
		for(var i=0; i<vecs.length; i+=3) {
			var x = vecs[i    ];
			var y = vecs[i + 1];
			var z = vecs[i + 2];
			xfvecs[i    ] = mat.m00 * x + mat.m01 * y + mat.m02 * z + mat.m03;
			xfvecs[i + 1] = mat.m10 * x + mat.m11 * y + mat.m12 * z + mat.m13;
			xfvecs[i + 2] = mat.m20 * x + mat.m21 * y + mat.m22 * z + mat.m23;
		}
	},

	/**
		Transform vectors using the given matrix. Only z components (transformed) will be written out.
		@param {JSC3D.Matrix3x4} mat the transformation matrix.
		@param {Array} vecs a batch of vectors to be transform.
		@param {Array} xfveczs where to output the transformed z components of the input vectors.
	 */
	transformVectorZs: function(mat, vecs, xfveczs) {
		var num = vecs.length / 3;
		var i = 0, j = 0
		while(i < num) {
			xfveczs[i] = mat.m20 * vecs[j] + mat.m21 * vecs[j + 1] + mat.m22 * vecs[j + 2] + mat.m23;
			i++;
			j += 3;
		}
	},

	/**
		Normalize vectors.
		@param {Array} src a batch of vectors to be normalized.
		@param {Array} dest where to output the normalized results.
	 */
	normalizeVectors: function(src, dest) {
		var num = src.length;
		for(var i=0; i<num; i+=3) {
			var x = src[i    ];
			var y = src[i + 1];
			var z = src[i + 2];
			var len = Math.sqrt(x * x + y * y + z * z);
			if(len > 0) {
				len = 1 / len;
				x *= len;
				y *= len;
				z *= len;
			}

			dest[i    ] = x;
			dest[i + 1] = y;
			dest[i + 2] = z;
		}
	}

};

export default Math3D
