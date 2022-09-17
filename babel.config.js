module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['import', {
      libraryName: 'ant-design-vue',
      libraryDirectory: 'es',
      style: name => `${name}/style/css`
    }, 'ant-design-vue  ']
  ]
}