import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import cleanup from "rollup-plugin-cleanup";

const output = (file, format, sourcemap) => ({
    input: './lib/obj2gltf.js',
    output: {
        name: 'obj2gltf',
        file,
        format,
        sourcemap,
    },
    plugins: [
        nodeResolve({
            browser: true,
            preferBuiltins: false
        }),
        commonjs(),
        !sourcemap ? cleanup() : undefined,
        !sourcemap ? terser() : undefined,
    ],
    // 用来指定代码执行环境的参数，解决this执行undefined问题 
    context: 'window',
});

export default [
    output('./bin/obj2gltf.js', 'umd', true),
    output('./bin/obj2gltf.min.js', 'umd', false),
    output('./bin/obj2gltf.esm.js', 'esm', true),
    output('./bin/obj2gltf.esm.min.js', 'esm', false),
]