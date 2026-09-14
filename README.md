# obj2gltf

浏览器端 OBJ → glTF 2.0 模型转换库，基于 [CesiumGS/obj2gltf](https://github.com/CesiumGS/obj2gltf)（v3.2.0）修改而来。传入 OBJ 文件的 URL，直接在浏览器中完成解析与转换，返回 glTF JSON 对象，无需服务器参与。

## 特性

- 完整解析 OBJ 几何结构：`o` → node、`g` → mesh、`usemtl` → primitive，n 边形自动三角化
- 解析 MTL 材质并转换为 PBR 材质：metallicRoughness（默认）/ specularGlossiness / unlit
- 支持向上轴转换（X / Y / Z 互换）
- mtl / 纹理路径基于 OBJ 所在 URL 解析：支持子目录引用（如 `mtllib sub/box.mtl`），加载失败时自动回退到 OBJ 同目录

## 环境要求

- 现代浏览器（依赖 `fetch`、`URL`、`btoa` 等 API，不支持 IE）
- OBJ / MTL 文件须通过 HTTP(S) 访问（`file://` 协议不可用）；跨域资源需服务端开启 CORS
- 转换过程只请求 OBJ 和 MTL 文件，**不会下载纹理图片**

## 导入

### 浏览器 script 标签

```html
<script src="https://cdn.jsdelivr.net/npm/@lijuhong1981/obj2gltf/bin/obj2gltf.min.js"></script>
<!-- 或本地路径 -->
<script src="obj2gltf/bin/obj2gltf.min.js"></script>
```

挂载为全局变量 `obj2gltf`。

### npm 安装

```bash
npm install @lijuhong1981/obj2gltf
```

打包工具（Vite / webpack / Rollup 等）中直接导入：

```js
import obj2gltf from '@lijuhong1981/obj2gltf';
```

Node 环境请显式指定 ESM 产物路径（本包为纯 ESM，`require` 无法获取导出）：

```js
import obj2gltf from '@lijuhong1981/obj2gltf/bin/obj2gltf.esm.min.js';
// 或 CommonJS 项目中使用动态导入：
const obj2gltf = (await import('@lijuhong1981/obj2gltf/bin/obj2gltf.esm.min.js')).default;
```

## 使用

```js
obj2gltf(objUrl, {
    inputUpAxis: 'Y',
    outputUpAxis: 'Y',
}).then(function (gltf) {
    // glTF 2.0 JSON 对象
}).catch(function (error) {
    console.error(error);
});
```

### 返回值

`Promise` 解析为 glTF 2.0 JSON 对象：

- 几何数据（顶点、法线、UV、索引）以 base64 内嵌在 `gltf.buffers[0].uri`
- 纹理不内嵌、不下载：`gltf.images[i].uri` 默认为纹理的**绝对 URL**（基于 mtl 所在目录解析，含子目录引用），设置 `resolveTextureUris: false` 可保留纯文件名；纹理图片由调用方按该 URI 加载

### options 参数

| 参数 | 默认值 | 说明 |
|---|---|---|
| `inputUpAxis` / `outputUpAxis` | `'Y'` | OBJ / 输出 glTF 的向上轴，可选 `'X'` `'Y'` `'Z'` |
| `metallicRoughness` | `false` | MTL 中的值已是 metallic-roughness PBR 值，不做换算 |
| `specularGlossiness` | `false` | MTL 中的值已是 specular-glossiness PBR 值，使用 `KHR_materials_pbrSpecularGlossiness` 扩展 |
| `unlit` | `false` | 无光照材质，使用 `KHR_materials_unlit` 扩展 |
| `doubleSidedMaterial` | `false` | 材质强制双面渲染 |
| `triangleWindingOrderSanitization` | `false` | 依据顶点法线清洗三角形绕序 |
| `overridingTextures` | `{}` | 覆盖 MTL 中声明的纹理（`baseColorTexture`、`normalTexture`、`emissiveTexture`、`alphaTexture`、`occlusionTexture`、`metallicRoughnessOcclusionTexture`、`specularGlossinessTexture`） |
| `resolveTextureUris` | `true` | 将输出 glTF 中的纹理 URI 解析为绝对 URL（基于 mtl 所在目录）；`false` 时保留纯文件名 |
| `logger` | `console.log` | 日志回调函数 |

`metallicRoughness`、`specularGlossiness`、`unlit` 三者至多启用一个；同时设置 `metallicRoughnessOcclusionTexture` 与 `specularGlossinessTexture` 会抛错。

原版的 `binary`、`separate`、`separateTextures`、`checkTransparency`、`packOcclusion`、`secure`、`writer`、`outputDirectory` 等选项在浏览器端不支持，传入会被忽略。

## 在 CesiumJS 中使用

转换结果可直接交给 Cesium 的 `Model` API（Cesium 1.97+）：

```js
async function loadObjModel(viewer, objUrl, lon, lat, height) {
    // 浏览器端完成转换
    // 纹理 URI 默认已解析为绝对地址（resolveTextureUris: true），无需再处理
    const gltf = await obj2gltf(objUrl);

    const model = await Cesium.Model.fromGltfAsync({
        gltf: gltf,
        modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
            Cesium.Cartesian3.fromDegrees(lon, lat, height)
        ),
        scale: 1.0,
    });
    viewer.scene.primitives.add(model);

    // 飞到模型
    viewer.scene.camera.flyToBoundingSphere(model.boundingSphere);
    return model;
}

loadObjModel(viewer, 'https://example.com/models/building.obj', 116.39, 39.9, 0);
```

要点：

- 保持默认 `outputUpAxis: 'Y'`：glTF 规范为 Y-up，Cesium 会自动完成到 Z-up 的坐标转换
- 旧版 Cesium（< 1.97）改用同步 API：`viewer.scene.primitives.add(Cesium.Model.fromGltf({ gltf, modelMatrix }))`
- Entity 方式需先将 JSON 转为 blob URL（默认输出的纹理绝对地址不受 blob 基准影响）：

  ```js
  const blobUrl = URL.createObjectURL(
      new Blob([JSON.stringify(gltf)], { type: 'model/gltf+json' })
  );
  viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(lon, lat, height),
      model: { uri: blobUrl },
  });
  ```

- OBJ / MTL / 纹理文件需允许跨域访问（Cesium 通过 fetch 拉取）；大模型的 base64 内嵌体积约膨胀 33%，超大模型建议服务端预转换

## 与原版（Node CLI）的差异

- 文件读取由 Node `fs` 改为 `fetch`；转换结果直接返回，不写磁盘
- 二进制处理改用 `DataView` / `Uint8Array`（base64 用 `btoa`），无需 Buffer polyfill
- 移除 glb 二进制输出（`gltfToGlb`）
- 纹理不解码：pngjs / jpeg-js 像素级处理全部移除，因此透明度逐像素检查、PBR 纹理打包（diffuse+alpha、metallicRoughnessOcclusion 等）不生效
- 移除 `secure` 目录越界检查与分离资源写出
- mtl / 纹理路径按浏览器 URL 语义解析（原版使用 Node path）

## 许可证

[Apache-2.0](LICENSE.md)。本项目衍生自 [CesiumGS/obj2gltf](https://github.com/CesiumGS/obj2gltf)（Apache-2.0），原版权归属 Cesium GS, Inc. and Contributors，浏览器化修改部分版权归 lijuhong1981。
