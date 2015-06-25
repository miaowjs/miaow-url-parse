var assert = require('assert');
var fs = require('fs');
var miaow = require('miaow');
var path = require('path');

var parse = require('../index');
describe('正常模式', function () {
  this.timeout(10e3);

  var log;

  before(function (done) {
    miaow.compile({
      cwd: path.resolve(__dirname, './fixtures/normal'),
      output: path.resolve(__dirname, './output'),
      domain: '//www.example.com',
      pack: false,
      module: {
        tasks: [
          {
            test: /\.(js|css)$/,
            plugins: [parse]
          }
        ]
      }
    }, function (err) {
      if (err) {
        console.error(err.toString());
        process.exit(1);
      }
      log = JSON.parse(fs.readFileSync(path.resolve(__dirname, './output/miaow.log.json')));
      done();
    });
  });

  it('接口是否存在', function () {
    assert(!!parse);
  });

  it('样式中获取图片的链接', function () {
    assert.equal(log.modules['foo.css'].hash, '2ff57b3515d6ffa661ae1a8f8b4f3c30');
  });

  it('脚本中嵌入样式', function () {
    assert.equal(log.modules['foo.js'].hash, 'f1c86ae785fb372454d810d0d6e30573');
  });
});

describe('更换关键字', function () {
  this.timeout(10e3);

  var log;

  before(function (done) {
    miaow.compile({
      cwd: path.resolve(__dirname, './fixtures/keyword'),
      output: path.resolve(__dirname, './output'),
      domain: '//www.example.com',
      pack: false,
      module: {
        tasks: [
          {
            test: /\.(js|css)$/,
            plugins: [{
              plugin: parse,
              option: {
                keyword: 'fullurl'
              }
            }]
          }
        ]
      }
    }, function (err) {
      if (err) {
        console.error(err.toString());
        process.exit(1);
      }
      log = JSON.parse(fs.readFileSync(path.resolve(__dirname, './output/miaow.log.json')));
      done();
    });
  });

  it('接口是否存在', function () {
    assert(!!parse);
  });

  it('样式中获取图片的链接', function () {
    assert.equal(log.modules['foo.css'].hash, '2ff57b3515d6ffa661ae1a8f8b4f3c30');
  });

  it('脚本中获取样式的链接', function () {
    assert.equal(log.modules['foo.js'].hash, 'f1c86ae785fb372454d810d0d6e30573');
  });
});

describe('不设置域名', function () {
  this.timeout(10e3);

  var log;

  before(function (done) {
    miaow.compile({
      cwd: path.resolve(__dirname, './fixtures/normal'),
      output: path.resolve(__dirname, './output'),
      domain: '',
      pack: false,
      module: {
        tasks: [
          {
            test: /\.(js|css)$/,
            plugins: [parse]
          }
        ]
      }
    }, function (err) {
      if (err) {
        console.error(err.toString());
        process.exit(1);
      }
      log = JSON.parse(fs.readFileSync(path.resolve(__dirname, './output/miaow.log.json')));
      done();
    });
  });

  it('接口是否存在', function () {
    assert(!!parse);
  });

  it('样式中获取图片的链接', function () {
    assert.equal(log.modules['foo.css'].hash, '957b1e34d37b8c2d2372d2efd5eabbb1');
  });

  it('脚本中获取样式的链接', function () {
    assert.equal(log.modules['foo.js'].hash, 'db5c51995ae056df0e76b377e0d7e268');
  });
});

describe('更换正则表达式', function () {
  this.timeout(10e3);

  var log;

  before(function (done) {
    miaow.compile({
      cwd: path.resolve(__dirname, './fixtures/regexp'),
      output: path.resolve(__dirname, './output'),
      domain: '//www.example.com',
      pack: false,
      module: {
        tasks: [
          {
            test: /\.(js|css)$/,
            plugins: [{
              plugin: parse,
              option: {
                reg: /['"\(]\s*([\w_\/\.\-]*\.(?:jpg|jpeg|png|gif|cur|js|css|eot|woff|ttf|svg))[^'"\)]*\s*['"\)]/gi
              }
            }]
          }
        ]
      }
    }, function (err) {
      if (err) {
        console.error(err.toString());
        process.exit(1);
      }
      log = JSON.parse(fs.readFileSync(path.resolve(__dirname, './output/miaow.log.json')));
      done();
    });
  });

  it('接口是否存在', function () {
    assert(!!parse);
  });

  it('样式中获取图片和字体的链接', function () {
    assert.equal(log.modules['foo.css'].hash, '0c7ebcfb3c46721869ebfa808dcd8330');
  });

  it('脚本中获取样式的链接', function () {
    assert.equal(log.modules['foo.js'].hash, '837b3315094b70db726a747efbff318a');
  });
});
