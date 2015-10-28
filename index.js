var async = require('async');

var pkg = require('./package.json');

module.exports = function(options, callback) {
  var context = this;
  var keyword = options.keyword || 'url';
  var reg = options.regexp || new RegExp('[\'\"\\(]\\s*([\\w\\_\\/\\.\\-]+\\#' + keyword + ')\\s*[\'\"\\)]', 'gi');
  var contents = context.contents.toString();
  var urlMap = {};

  async.eachSeries(
    contents.match(reg) || [],
    function(relative, callback) {
      reg.lastIndex = 0;
      var result = reg.exec(relative);
      context.resolveModule(result[1].replace(/\#[^\#]+$/, ''), function(err, relativeModule) {
        if (err) {
          return callback(err);
        }

        urlMap[result[1]] = relativeModule.url;

        callback();
      });
    },

    function(err) {
      if (err) {
        return callback(err);
      }

      contents = contents.replace(reg, function(str, key) {
        return str.replace(key, urlMap[key]);
      });

      context.contents = new Buffer(contents);

      callback();
    });
};

module.exports.toString = function() {
  return [pkg.name, pkg.version].join('@');
};
