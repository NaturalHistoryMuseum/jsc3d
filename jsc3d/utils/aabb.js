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
	@class AABB

	This class implements the Axis-Aligned Bounding Box to measure spatial enclosure.
 */
const AABB = function() {
	/**
	 * {Number} X coordinate of the minimum edge of the box.
	 */
	this.minX = 0;
	/**
	 * {Number} Y coordinate of the minimum edge of the box.
	 */
	this.minY = 0;
	/**
	 * {Number} Z coordinate of the minimum edge of the box.
	 */
	this.minZ = 0;
	/**
	 * {Number} X coordinate of the maximum edge of the box.
	 */
	this.maxX = 0;
	/**
	 * {Number} Y coordinate of the maximum edge of the box.
	 */
	this.maxY = 0;
	/**
	 * {Number} Z coordinate of the maximum edge of the box.
	 */
	this.maxZ = 0;
};

/**
	Get center coordinates of the AABB.
	@param {Array} c an array to receive the result.
	@returns {Array} center coordinates as an array.
 */
AABB.prototype.center = function(c) {
	if(c) {
		c[0] = 0.5 * (this.minX + this.maxX);
		c[1] = 0.5 * (this.minY + this.maxY);
		c[2] = 0.5 * (this.minZ + this.maxZ);
	}
	else
		c = [0.5 * (this.minX + this.maxX), 0.5 * (this.minY + this.maxY), 0.5 * (this.minZ + this.maxZ)];
	return c;
};

/**
	Get the length of the diagonal of the AABB.
	@returns {Number} length of the diagonal.
 */
AABB.prototype.lengthOfDiagonal = function() {
	var xx = this.maxX - this.minX;
	var yy = this.maxY - this.minY;
	var zz = this.maxZ - this.minZ;
	return Math.sqrt(xx * xx + yy * yy + zz * zz);
};

export default AABB;
