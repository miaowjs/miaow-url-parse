var async = require('async');
var mutil = require('miaow-util');
var path = require('path');

var pkg = require('./package.json');

/**
 * 解析主入口
 */
function parse(option, cb) {
  var keyword = option.keyword || 'url';
  var reg = option.reg || new RegExp('[\'\"\\(]\\s*([\\w\\_\\/\\.\\-]+\\#' + keyword + ')\\s*[\'\"\\)]', 'gi');
  var contents = this.contents.toString();
  var urlMap = {};

  var module = this;
  async.eachSeries(contents.match(reg) || [], function (relative, cb) {
    reg.lastIndex = 0;
    var result = reg.exec(relative);
    module.getModule(result[1].replace(/\#[^\#]+$/, ''), function (err, relativeModule) {
      if (err) {
        return cb(err);
      }

      urlMap[result[1]] =
        relativeModule.url ||
        mutil.relative(path.dirname(module.destAbsPath), relativeModule.destAbsPathWithHash);

      cb();
    });
  }, function (err) {
    if (err) {
      return cb(err);
    }

    contents = contents.replace(reg, function (str, key) {
      return str.replace(key, urlMap[key]);
    });

    module.contents = new Buffer(contents);

    cb();
  });
}

module.exports = mutil.plugin(pkg.name, pkg.version, parse);
