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

import AABB from './aabb';

/**
	@class Scene

	This class implements scene that contains a group of meshes that forms the world.
 */
const Scene = function(name) {
	this.name = name || '';
	this.srcUrl = '';
	this.aabb = null;
	this.children = [];
	this.maxChildId = 1;
};

/**
	Initialize the scene.
 */
Scene.prototype.init = function() {
	if(this.isEmpty())
		return;

	for(var i=0; i<this.children.length; i++)
		this.children[i].init();

	if(!this.aabb) {
		this.aabb = new AABB;
		this.calcAABB();
	}
};

/**
	See if the scene is empty.
	@returns {Boolean} true if it does not contain meshes; false if it has any.
 */
Scene.prototype.isEmpty = function() {
	return (this.children.length == 0);
};

/**
	Add a mesh to the scene.
	@param {Mesh} mesh the mesh to be added.
 */
Scene.prototype.addChild = function(mesh) {
	mesh.internalId = this.maxChildId++;
	this.children.push(mesh);
};

/**
	Remove a mesh from the scene.
	@param {Mesh} mesh the mesh to be removed.
 */
Scene.prototype.removeChild = function(mesh) {
	var foundAt = this.children.indexOf(mesh);
	if(foundAt >= 0)
		this.children.splice(foundAt, 1);
};

/**
	Get all meshes in the scene.
	@returns {Array} meshes as an array.
 */
Scene.prototype.getChildren = function() {
	return this.children.slice(0);
};

/**
	Traverse meshes in the scene, calling a given function on each of them.
	@param {Function} operator a function that will be called on each mesh.
 */
Scene.prototype.forEachChild = function(operator) {
	if((typeof operator) != 'function')
		return;

	for(var i=0; i<this.children.length; i++) {
		if(operator.call(null, this.children[i]))
			break;
	}
};

/**
	Calculate AABB of the scene.
	@private
 */
Scene.prototype.calcAABB = function() {
	this.aabb.minX = this.aabb.minY = this.aabb.minZ = Infinity;
	this.aabb.maxX = this.aabb.maxY = this.aabb.maxZ = -Infinity;
	for(var i=0; i<this.children.length; i++) {
		var child = this.children[i];
		if(!child.isTrivial()) {
			var minX = child.aabb.minX;
			var minY = child.aabb.minY;
			var minZ = child.aabb.minZ;
			var maxX = child.aabb.maxX;
			var maxY = child.aabb.maxY;
			var maxZ = child.aabb.maxZ;
			if(this.aabb.minX > minX)
				this.aabb.minX = minX;
			if(this.aabb.minY > minY)
				this.aabb.minY = minY;
			if(this.aabb.minZ > minZ)
				this.aabb.minZ = minZ;
			if(this.aabb.maxX < maxX)
				this.aabb.maxX = maxX;
			if(this.aabb.maxY < maxY)
				this.aabb.maxY = maxY;
			if(this.aabb.maxZ < maxZ)
				this.aabb.maxZ = maxZ;
		}
	}
};

/**
 * {String} Name of the scene.
 */
Scene.prototype.name = '';
/**
 * {String} Source URL of the scene, empty if none. Read only.
 */
Scene.prototype.srcUrl = '';
/**
 * {AABB} The Axis-aligned bounding box of the whole scene. Read only.
 */
Scene.prototype.aabb = null;
Scene.prototype.children = null;
Scene.prototype.maxChildId = 1;

export default Scene;
