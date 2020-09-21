// 这个使用node.js写的

// // postCss配置文件
// module.exports = {
//   plugins: {
//     //
//     // VueCLI 内部已经配置了 autoprefixer插件，所有又配置了一次，所以产生了冲突
//     // autoprefixer: {
// 可以实现自动添加浏览器相关的声明前缀
//     // 配置要兼容到的环境信息
//     //   browsers: ['Android >= 4.0', 'iOS >= 8']
//     // },

//     // 配置使用postcss-pxtorem插件
//     // 作用: 把px转为rem
//     'postcss-pxtorem': {
//       // lib-flexible的rem适配方案：把一行分为10分，每分就是十分之一
//       // 所以rootValue应该设置为设计高宽度的十分之一
//       // vant建议设置为37.5  为什么？因为vant是基于375写的
//       // rootValue支持两种类型：
//       //    数字
//       //    函数
//       rootValue({ file }) {
//         return file.indexOf('vant') !== -1 ? 37.5 : 75
//       },
//       // rootValue: 37.5,
//       // 配置要转换的css属性
//       // *表示所有
//       propList: ['*']
//     }
//   }
// }
module.exports = {
  plugins: {
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      // rootValue: 37.5,
      rootValue({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*'],
      exclude: 'github-markdown'
    }
  }
}
