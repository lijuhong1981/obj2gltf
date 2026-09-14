"use strict";
// const Cesium = require("cesium");

// const ComponentDatatype = Cesium.ComponentDatatype;
import ComponentDatatype from "./cesium/engine/Source/Core/ComponentDatatype.js";

// module.exports = ArrayStorage;

const initialLength = 1024; // 2^10
const doublingThreshold = 33554432; // 2^25 (~134 MB for a Float32Array)
const fixedExpansionLength = 33554432; // 2^25 (~134 MB for a Float32Array)

/**
 * Provides expandable typed array storage for geometry data. This is preferable to JS arrays which are
 * stored with double precision. The resizing mechanism is similar to std::vector.
 *
 * @param {ComponentDatatype} componentDatatype The data type.
 *
 * @private
 */
function ArrayStorage(componentDatatype) {
  this.componentDatatype = componentDatatype;
  this.typedArray = ComponentDatatype.createTypedArray(componentDatatype, 0);
  this.length = 0;
}

function resize(storage, length) {
  const typedArray = ComponentDatatype.createTypedArray(
    storage.componentDatatype,
    length,
  );
  typedArray.set(storage.typedArray);
  storage.typedArray = typedArray;
}

ArrayStorage.prototype.push = function (value) {
  const length = this.length;
  const typedArrayLength = this.typedArray.length;

  if (length === 0) {
    resize(this, initialLength);
  } else if (length === typedArrayLength) {
    if (length < doublingThreshold) {
      resize(this, typedArrayLength * 2);
    } else {
      resize(this, typedArrayLength + fixedExpansionLength);
    }
  }

  this.typedArray[this.length++] = value;
};

ArrayStorage.prototype.get = function (index) {
  return this.typedArray[index];
};

const sizeOfUint16 = 2;
const sizeOfUint32 = 4;
const sizeOfFloat = 4;

ArrayStorage.prototype.toUint16Buffer = function () {
  const length = this.length;
  const typedArray = this.typedArray;
  const paddedLength = length + (length % 2 === 0 ? 0 : 1); // Round to next multiple of 2
  const arrayBuffer = new ArrayBuffer(paddedLength * sizeOfUint16);
  const dataView = new DataView(arrayBuffer);
  for (let i = 0; i < length; ++i) {
    dataView.setUint16(i * sizeOfUint16, typedArray[i], true); // little-endian
  }
  return new Uint8Array(arrayBuffer);
};

ArrayStorage.prototype.toUint32Buffer = function () {
  const length = this.length;
  const typedArray = this.typedArray;
  const arrayBuffer = new ArrayBuffer(length * sizeOfUint32);
  const dataView = new DataView(arrayBuffer);
  for (let i = 0; i < length; ++i) {
    dataView.setUint32(i * sizeOfUint32, typedArray[i], true); // little-endian
  }
  return new Uint8Array(arrayBuffer);
};

ArrayStorage.prototype.toFloatBuffer = function () {
  const length = this.length;
  const typedArray = this.typedArray;
  const arrayBuffer = new ArrayBuffer(length * sizeOfFloat);
  const dataView = new DataView(arrayBuffer);
  for (let i = 0; i < length; ++i) {
    dataView.setFloat32(i * sizeOfFloat, typedArray[i], true); // little-endian
  }
  return new Uint8Array(arrayBuffer);
};

ArrayStorage.prototype.getMinMax = function (components) {
  const length = this.length;
  const typedArray = this.typedArray;
  const count = length / components;
  const min = new Array(components).fill(Number.POSITIVE_INFINITY);
  const max = new Array(components).fill(Number.NEGATIVE_INFINITY);
  for (let i = 0; i < count; ++i) {
    for (let j = 0; j < components; ++j) {
      const index = i * components + j;
      const value = typedArray[index];
      min[j] = Math.min(min[j], value);
      max[j] = Math.max(max[j], value);
    }
  }
  return {
    min: min,
    max: max,
  };
};

export default ArrayStorage;