import { fileURLToPath, URL } from 'node:url'
import path from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacyPlugin from '@vitejs/plugin-legacy'
// import topLevelAwait from 'vite-plugin-top-level-await'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        legacyPlugin({
            targets: ['defaults', 'ie >= 11', 'chrome 52'],  //需要兼容的目标列表，可以设置多个
         additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
         renderLegacyChunks:true,
         polyfills:[
            'es.symbol',
            'es.array.filter',
            'es.promise',
            'es.promise.finally',
            'es/map',
            'es/set',
            'es.array.for-each',
            'es.object.define-properties',
            'es.object.define-property',
            'es.object.get-own-property-descriptor',
            'es.object.get-own-property-descriptors',
            'es.object.keys',
            'es.object.to-string',
            'web.dom-collections.for-each',
            'esnext.global-this',
            'esnext.string.match-all'
        ]
        }),
        // topLevelAwait({
        //     promiseExportName: '__tla',
        //     promiseImportName: i => `__tla_${i}`
        // })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                additionalData: `@import "${path.resolve(__dirname, 'src/assets/global.less')}";`
            }
        }
    },
    base: "./",
    build: {
        chunkSizeWarningLimit:1500,
        rollupOptions: {
            output:{
                manualChunks(id) {
                  if (id.includes('node_modules')) {
                    
                      return id.toString().split('node_modules/')[1].split('/')[0].toString();
                  }
              }
            }
        }
      }

})
