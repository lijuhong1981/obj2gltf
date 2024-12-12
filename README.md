# obj2gltf
基于[CesiumGS/obj2gltf](https://github.com/CesiumGS/obj2gltf)修改而来，可以直接在浏览器中使用。

## 通过文件导入

浏览器直接导入

```html
<script type="text/javascript" src="obj2gltf/bin/obj2gltf.min.js"></script>
```

模块化导入

```js
// CommonJS:
const obj2gltf = require('obj2gltf/bin/obj2gltf.min.js');

// ES6:
import obj2gltf from 'obj2gltf/bin/obj2gltf.esm.min.js';
```

## 通过npm导入

### 安装

```bash
npm install @lijuhong1981/obj2gltf
```

### 导入

```js
// CommonJS:
const obj2gltf = require('@lijuhong1981/obj2gltf');

// ES6:
import obj2gltf from '@lijuhong1981/obj2gltf';
```

## 使用

```js
console.time('obj2gltf');
obj2gltf(url, options).then(function (gltf) {
    console.timeEnd('obj2gltf');
    // TODO
}).catch(function (error) {
    console.timeEnd('obj2gltf');
    console.error(error);
});
```
