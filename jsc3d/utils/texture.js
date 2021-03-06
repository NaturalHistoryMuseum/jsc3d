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
	@class Texture

	This class implements texture which describes the surface details for a mesh.
 */
const Texture = function(name, onready) {
	this.name = name || '';
	this.width = 0;
	this.height = 0;
	this.data = null;
	this.mipmaps = null;
	this.mipentries = null;
	this.hasTransparency = false;
	this.srcUrl = '';
	this.onready = (onready && typeof(onready) == 'function') ? onready : null;
};

/**
	Load an image and extract texture data from it.
	@param {String} imageUrl where to load the image.
	@param {Boolean} useMipmap set true to generate mip-maps; false(default) not to generate mip-maps.
 */
Texture.prototype.createFromUrl = function(imageUrl, useMipmap) {
	var self = this;
	var img = new Image;

	img.onload = function() {
		self.data = null;
		self.mipmaps = null;
		self.mipentries = null;
		self.width = 0;
		self.height = 0;
		self.hasTransparency = false;
		self.srcUrl = '';
		self.createFromImage(this, useMipmap);
			console.logInfo('Finished loading texture image file "' + this.src + '".');
	};

	img.onerror = function() {
		self.data = null;
		self.mipmaps = null;
		self.mipentries = null;
		self.width = 0;
		self.height = 0;
		self.hasTransparency = false;
		self.srcUrl = '';
			console.logWarning('Failed to load texture image file "' + this.src + '". This texture will be discarded.');
	};

	img.crossOrigin = 'anonymous'; // explicitly enable cross-domain image
	img.src = encodeURI(imageUrl);
};

/**
	Extract texture data from an exsisting image.
	@param {Image} image image as datasource of the texture.
	@param {Boolean} useMipmap set true to generate mip-maps; false(default) not to generate mip-maps.
 */
Texture.prototype.createFromImage = function(image, useMipmap) {
	if(image.width <=0 || image.height <=0)
		return;

	var isCanvasClean = false;
	var canvas = Texture.cv;
	if(!canvas) {
		try {
			canvas = document.createElement('canvas');
			Texture.cv = canvas;
			isCanvasClean = true;
		}
		catch(e) {
			return;
		}
	}

	// look for appropriate texture dimensions
	var dim = image.width > image.height ? image.width : image.height;
	if(dim <= 16)
		dim = 16;
	else if(dim <= 32)
		dim = 32;
	else if(dim <= 64)
		dim = 64;
	else if(dim <= 128)
		dim = 128;
	else if(dim <= 256)
		dim = 256;
	else if(dim <= 512)
		dim = 512;
	else
		dim = 1024;

	if(canvas.width != dim || canvas.height != dim) {
		canvas.width = canvas.height = dim;
		isCanvasClean = true;
	}

	var data;
	try {
		var ctx = canvas.getContext('2d');
		if(!isCanvasClean)
			ctx.clearRect(0, 0, dim, dim);
		ctx.drawImage(image, 0, 0, dim, dim);
		var imgData = ctx.getImageData(0, 0, dim, dim);
		data = imgData.data;
	}
	catch(e) {
		return;
	}

	var size = data.length / 4;
	this.data = new Array(size);
	var alpha;
	for(var i=0, j=0; i<size; i++, j+=4) {
		alpha = data[j + 3];
		this.data[i] = alpha << 24 | data[j] << 16 | data[j+1] << 8 | data[j+2];
		if(alpha < 255)
			this.hasTransparency = true;
	}

	this.width = dim;
	this.height = dim;

	this.mipmaps = null;
	if(useMipmap)
		this.generateMipmaps();

	this.srcUrl = image.src;

	if(this.onready != null && (typeof this.onready) == 'function')
		this.onready();
};

/**
	See if this texture contains texel data.
	@returns {Boolean} true if it has texel data; false if not.
 */
Texture.prototype.hasData = function() {
	return (this.data != null);
};

/**
	Generate mip-map pyramid for the texture.
 */
Texture.prototype.generateMipmaps = function() {
	if(this.width <= 1 || this.data == null || this.mipmaps != null)
		return;

	this.mipmaps = [this.data];
	this.mipentries = [1];

	var numOfMipLevels = 1 + ~~(0.1 + Math.log(this.width) * Math.LOG2E);
	var dim = this.width >> 1;
	for(var level=1; level<numOfMipLevels; level++) {
		var map = new Array(dim * dim);
		var uppermap = this.mipmaps[level - 1];
		var upperdim = dim << 1;

		var src = 0, dest = 0;
		for(var i=0; i<dim; i++) {
			for(var j=0; j<dim; j++) {
				var texel0 = uppermap[src];
				var texel1 = uppermap[src + 1];
				var texel2 = uppermap[src + upperdim];
				var texel3 = uppermap[src + upperdim + 1];
				var a = ( ((texel0 & 0xff000000) >>> 2) + ((texel1 & 0xff000000) >>> 2) + ((texel2 & 0xff000000) >>> 2) + ((texel3 & 0xff000000) >>> 2) ) & 0xff000000;
				var r = ( ((texel0 & 0xff0000) + (texel1 & 0xff0000) + (texel2 & 0xff0000) + (texel3 & 0xff0000)) >> 2 ) & 0xff0000;
				var g = ( ((texel0 & 0xff00) + (texel1 & 0xff00) + (texel2 & 0xff00) + (texel3 & 0xff00)) >> 2 ) & 0xff00;
				var b = ( ((texel0 & 0xff) + (texel1 & 0xff) + (texel2 & 0xff) + (texel3 & 0xff)) >> 2 ) & 0xff;
				map[dest] = a + r + g + b;
				src += 2;
				dest++;
			}
			src += upperdim;
		}

		this.mipmaps.push(map);
		this.mipentries.push(Math.pow(4, level));
		dim = dim >> 1;
	}
};

/**
	See if this texture has mip-maps.
	@returns {Boolean} true if it has mip-maps; false if not.
 */
Texture.prototype.hasMipmap = function() {
	return (this.mipmaps != null);
};

/**
 * {String} Name of the texture.
 */
Texture.prototype.name = '';
Texture.prototype.data = null;
Texture.prototype.mipmaps = null;
Texture.prototype.mipentries = null;
/**
 * {Number} Width of the texture in pixels. Read only.
 */
Texture.prototype.width = 0;
/**
 * {Number} Height of the texture in pixels. Read only.
 */
Texture.prototype.height = 0;
/**
 * {Boolean} Whether the texture contains tranparent pixels. Read only.
 */
Texture.prototype.hasTransparency = false;
/**
 * {String} URL of the image source of the texture. Read only.
 */
Texture.prototype.srcUrl = '';
/**
 * {Function} A callback function that will be invoked immediately as the texture is ready.
 */
Texture.prototype.onready = null;
Texture.cv = null;

export default Texture;
