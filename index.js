var async = require('async');
var mutil = require('miaow-util');
var path = require('path');

var pkg = require('./package.json');

/**
 * 解析主入口
 */
function parse(option, cb) {
  var keyword = option.keyword || 'url';
  var reg = new RegExp('[\'"\\(](([\\w\\_\\/\\.\\-]*)\\?' + keyword + ')[\'\"\\)]', 'gi');
  var contents = this.file.contents.toString();
  var urlMap = {};

  async.eachSeries(contents.match(reg) || [], function (relative, cb) {
    var result = reg.exec(relative);
    this.getModule(result[2], function (err, module) {
      if (err) {
        return cb(err);
      }

      urlMap[result[1]] = module.url || path.relative(path.dirname(this.destAbsPath), module.destAbsPathWithHash);
      cb();
    }.bind(this));
  }.bind(this), function (err) {
    if (err) {
      return cb(new mutil.PluginError(pkg.name, err, {
        fileName: this.file.path,
        showStack: true
      }));
    }

    contents = contents.replace(reg, function (str, key) {
      return str.replace(key, urlMap[key]);
    });

    this.file.contents = new Buffer(contents);

    cb();
  }.bind(this));
}

module.exports = parse;
