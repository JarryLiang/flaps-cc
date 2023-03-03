const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');


//https://coinmarketcap.com/

module.exports ={
  mode:'development',
  devtool: 'source-map',
  entry:{
    listen:'./src/listen.js',
    inject:'./src/inject.js',
    ui:"./src/ui.ts",
  },
  output:{
    path: path.resolve(__dirname,"dist"),
    filename:'[name].bundle.js'
  },
  plugins:[
    new CopyPlugin({
      patterns:[
        {
          from: 'template',
        },
      ]
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
  },
  module:{
   rules:[
     {
       test: /\.(j|t)sx?$/,
       exclude: [/node_modules/],
       use: [
         {
           loader: require.resolve('babel-loader'),
           options: {
             // ignore: [path.join(__dirname, 'node_modules/jqwidgets-scripts/jqwidgets')],
             presets: [
               ['@babel/preset-env', {
                 modules: 'auto',
                 targets: {
                   chrome: '65',
                   esmodules: true,
                 },
               }],
               '@babel/preset-react',
               '@babel/preset-typescript',
             ],
             // This is a feature of `babel-loader` for webpack (not Babel itself).
             // It enables caching results in ./node_modules/.cache/babel-loader/
             // directory for faster rebuilds.
             cacheDirectory: true,
             // Don't waste time on Gzipping the cache
             cacheCompression: false,
           },
         },
       ],
     },
     {
       test: /\.css$/,
       use: [
         {loader: 'style-loader'},
         {loader: 'css-loader'},
       ],
     },
     {
       test: /\.scss$/,
       use: [
         {loader: 'style-loader'},
         {
           loader: 'css-loader',
           options: {
             importLoaders: 1,
           },
         },
         {loader: 'sass-loader'},
       ],
     },
     {
       test: /\.(jpg|jpeg|png|gif)$/,
       use: [{
         loader: 'file-loader',
         options: {name: 'img/[name]_[hash:6].[ext]'},
       },
       ],
     },
   ]
  }

}

//https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing?start=101&limit=100&sortBy=market_cap&sortType=desc&convert=USD,BTC,ETH&cryptoType=all&tagType=all&audited=false&aux=ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,volume_7d,volume_30d
