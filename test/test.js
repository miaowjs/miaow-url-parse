var assert = require('assert');
var find = require('lodash.find');
var fs = require('fs');
var miaow = require('miaow');
var path = require('path');

var parse = require('../index');

function doCompile(context, done) {
  miaow({
    context: context
  }, function(err) {
    if (err) {
      console.error(err.toString(), err.stack);
      process.exit(1);
    }

    done(null, JSON.parse(fs.readFileSync(path.resolve(__dirname, './output/miaow.log.json'))));
  });
}

describe('正常模式', function() {
  this.timeout(10e3);

  var log;

  before(function(done) {
    doCompile(path.resolve(__dirname, './fixtures/normal'), function(err, _log) {
      log = _log;
      done(err);
    });
  });

  it('接口是否存在', function() {
    assert(!!parse);
  });

  it('样式中获取图片的链接', function() {
    assert.equal(find(log.modules, {src: 'foo.css'}).destHash, '62192b6ad2c8c6e83bc97f1cecff37b2');
  });

  it('脚本中嵌入样式', function() {
    assert.equal(find(log.modules, {src: 'foo.js'}).destHash, '035b543f354b25d615295ca89ea8c5f7');
  });

  it('添加依赖信息', function() {
    var fileDependencies = find(log.modules, {src: 'foo.css'}).fileDependencies;

    assert.equal(fileDependencies.length, 1);
    ['foo.png'].forEach(
      function(srcPath) {
        assert.notEqual(fileDependencies.indexOf(srcPath), -1);
      }
    );
  });
});

describe('更换关键字', function() {
  this.timeout(10e3);

  var log;

  before(function(done) {
    doCompile(path.resolve(__dirname, './fixtures/keyword'), function(err, _log) {
      log = _log;
      done(err);
    });
  });

  it('接口是否存在', function() {
    assert(!!parse);
  });

  it('样式中获取图片的链接', function() {
    assert.equal(find(log.modules, {src: 'foo.css'}).destHash, '62192b6ad2c8c6e83bc97f1cecff37b2');
  });

  it('脚本中获取样式的链接', function() {
    assert.equal(find(log.modules, {src: 'foo.js'}).destHash, 'b29f885b71ec2053aeaf52f1e2f6ece4');
  });

  it('添加依赖信息', function() {
    var fileDependencies = find(log.modules, {src: 'foo.css'}).fileDependencies;

    assert.equal(fileDependencies.length, 1);
    ['foo.png'].forEach(
      function(srcPath) {
        assert.notEqual(fileDependencies.indexOf(srcPath), -1);
      }
    );
  });
});

describe('更换正则表达式', function() {
  this.timeout(10e3);

  var log;

  before(function(done) {
    doCompile(path.resolve(__dirname, './fixtures/regexp'), function(err, _log) {
      log = _log;
      done(err);
    });
  });

  it('接口是否存在', function() {
    assert(!!parse);
  });

  it('样式中获取图片和字体的链接', function() {
    assert.equal(find(log.modules, {src: 'foo.css'}).destHash, 'eca2ee19e030494d38885512da999ec5');
  });

  it('脚本中获取样式的链接', function() {
    assert.equal(find(log.modules, {src: 'foo.js'}).destHash, 'd40fc589eaa82ddb58997ec7e6e2c78b');
  });

  it('添加依赖信息', function() {
    var fileDependencies = find(log.modules, {src: 'foo.css'}).fileDependencies;

    assert.equal(fileDependencies.length, 5);
    ['iconfont.eot', 'iconfont.woff', 'iconfont.ttf', 'iconfont.svg', 'foo.png'].forEach(
      function(srcPath) {
        assert.notEqual(fileDependencies.indexOf(srcPath), -1);
      }
    );
  });
});
