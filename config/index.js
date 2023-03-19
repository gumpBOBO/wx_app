// 项目配置
const path = require('path')
// 引入依赖
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// 导入compression-webpack-plugin:压缩资源,生成.gz文件
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
const config = {
  // 项目名称
  projectName: '廿壴(ganxb2)博客',
  // 项目创建日期
  date: '2022-11-9',
  // 设计稿尺寸
  // designWidth: 750,
  designWidth: 375,
  // 设计稿尺寸换算规则
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  alias: {
    // '@/': path.resolve(__dirname, '..', 'src'),
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils')
  },
  // 项目源码目录
  sourceRoot: 'src',
  // 项目产出目录
  // outputRoot: 'dist',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  // Taro 插件配置
  plugins: [
    '@tarojs/plugin-html',
    // 应用 Sass
    '@tarojs/plugin-sass'
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
    //   generateStatsFile: false // 是否生成stats.json文件
    // })
  ],
  // 给 sass-loader 传递选项 ！！！！ 按需加载方式必须配置
  sass: {
    // data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";`
    data: `@import "@nutui/nutui-taro/dist/styles/variables-jdt.scss";`
  },
  // 全局变量设置
  defineConstants: {},
  // 文件 copy 配置
  copy: {
    patterns: [],
    options: {}
  },
  // 框架，react，nerv，vue, vue3 等
  framework: 'vue3',
  compiler: 'webpack5',
  cache: {
    enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
	// 配置只在生产模式下生效(去除consoloe)
	terser: {
    enable: true,
    config: {
      // 配置项同 https://github.com/terser/terser#minify-options
			ecma: undefined,
			warnings: false,
			parse: {},
			compress: { 
				drop_console: true,
				drop_debugger: false,
				pure_funcs: ['console.log'] // 移除console
			}
    },
  },
  // 小程序端专用配置
  mini: {
    // 可开启智能提取分包依赖插件 by ganxb
    optimizeMainPackage: {
      enable: true,
      exclude: [
        // path.resolve(__dirname, '../src/utils/moduleName.js'),
        // module => module.resource?.indexOf('pinia') >= 0
      ]
    },
    // 当进行分包后必须手动为调用的页面绑定
    // addChunkPages(pages) {
    //   //使用到了pinia,nutui的页面中注入common依赖
    //   pages.set('pages/index/index', ['pinia'])
    // },
    // 当进行分包后必须手动重新指定打包文件 普通编译时的默认值：['runtime', 'vendors', 'taro', 'common']
    // runtime: webpack 运行时入口
    // taro: node_modules 中 Taro 相关依赖
    // vendors: node_modules 除 Taro 外的公共依赖
    // common: 项目中业务代码公共逻辑
		// 如果这里不配置，只有分包引用的插件会变成无依赖！！！
    commonChunks: ['runtime', 'vendors', 'taro', 'common', 'nutui', 'pinia', 'leancloud'],
    // 自定义 Webpack 配置
    webpackChain(chain, webpack) {
			// 环境判断
			if (process.env.NODE_ENV === 'production') {
				// console.log('生产环境----', webpack)
				// // 为生产环境修改配置...
				// config.optimization.minimizer[0].options.minimizer.options.compress = Object.assign(
				// 	config.optimization.minimizer[0].options.minimizer.options.compress,
				// 	{
				// 		drop_console: true
				// 	}
				// );
			} else {
				// 为开发环境修改配置...
			}
      chain.plugin('analyzer').use(BundleAnalyzerPlugin)
      chain.merge({
        optimization: {
          // runtimeChunk: {}
          splitChunks: {
            cacheGroups: {
              vendors: {
                name: 'vendors',
                minChunks: 2,
                test: module => {
                  return /[\\/]node_modules[\\/]/.test(module.resource)
                },
                priority: 10
              },
              nutui: {
                name: 'nutui',
                test: /[\\/]node_modules[\\/]@nutui[\\/]/,
                priority: 15, // 优先级 > vendors的10，故优先优化
                enforce: true, // 始终为此缓存组创建chunk 忽略 minSize、minChunks、maxAsyncRequests、maxInitialRequests
                reuseExistingChunk: true // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。
              },
              pinia: {
                name: 'pinia',
                test: /[\\/]node_modules[\\/]pinia[\\/]/,
                priority: 20, // 优先级 > vendors的10，故优先优化
                enforce: true, // 始终为此缓存组创建chunk 忽略 minSize、minChunks、maxAsyncRequests、maxInitialRequests
                reuseExistingChunk: true // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。
              },
              leancloud: {
                name: 'leancloud',
                test: /[\\/]node_modules[\\/]leancloud-storage[\\/]/,
                priority: 25, // 优先级 > vendors的10，故优先优化
                // enforce: true, // 始终为此缓存组创建chunk 忽略 minSize、minChunks、maxAsyncRequests、maxInitialRequests
                reuseExistingChunk: true // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。
              }
              // vendors_react: {
              //   name: "vendors_react",
              //   test: /[\\/]node_modules[\\/]react[\\/]/,
              //   priority: 20,
              //   enforce: true,
              //   reuseExistingChunk: true
              // }
            }
          }
        },
        module: {
          rule: {
            // 对pinia的不同后缀文件预处理
            mjsScript: {
              test: /\.mjs$/,
              include: [/pinia/],
              use: {
                babelLoader: {
                  loader: require.resolve('babel-loader')
                }
              }
            }
            // 这是一个添加 raw-loader 的例子，用于在项目中直接引用 md 文件
            // myloader: {
            //   test: /\.md$/,
            //   use: [
            //     {
            //       loader: 'raw-loader',
            //       options: {},
            //     },
            //   ],
            // },
          }
        },
				plugin: {
          install: {
            plugin: require('compression-webpack-plugin'),
            args: [{
              test: /\.(js|css)/,
              // filename: '[path].gz[query]',
							// FIXME: webpack最新版本必须改成这样 => completed
							filename: '[path][base].gz',
              algorithm: 'gzip',
              threshold: 10240,
              minRatio: 0.8
            }]
          }
        },
      })
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      // 小程序端样式引用本地资源内联配置
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    // performance: {
    //   hints: 'warning', //入口起点的最大体积
    //   maxEntrypointSize: 50000000, //生成文件的最大体积
    //   maxAssetSize: 300000000, //只给出 js 文件的性能提示
    //   assetFilter: function (assetFilename) {
    //     return assetFilename.endsWith('.js')
    //   }
    // }
  },
  // H5 端专用配置
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
    // 自定义 Webpack 配置
    // webpackChain (chain, webpack) {},
    // devServer: {}
    // taro-ui by ganxb
    // esnextModules: ['taro-ui']
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
