var JAR_PATH, JAVA_PATH, OPTIONS, path, spawn;
spawn = require('child_process').spawn;
path = require('path');
JAVA_PATH = exports.JAVA_PATH = 'java';
JAR_PATH = exports.JAR_PATH = path.join(__dirname, 'vendor/compiler.jar');
OPTIONS = exports.OPTIONS = {};
exports.compile = function(input, options, callback) {
  var args, compiler, result, stderr, stdout;
  if (callback) {
    result = {};
    Object.keys(OPTIONS).forEach(function(key) {
      return result[key] = OPTIONS[key];
    });
    Object.keys(options).forEach(function(key) {
      return result[key] = options[key];
    });
    options = result;
  } else {
    callback = options;
    options = OPTIONS;
  }
  args = ['-jar', JAR_PATH];
  Object.keys(options).forEach(function(key) {
    args.push("--" + key);
    return args.push("" + options[key]);
  });
  compiler = spawn(JAVA_PATH, args);
  stdout = '';
  stderr = '';
  compiler.stdout.setEncoding('utf8');
  compiler.stderr.setEncoding('utf8');
  compiler.stdout.on('data', function(data) {
    return stdout += data;
  });
  compiler.stderr.on('data', function(data) {
    return stderr += data;
  });
  compiler.on('exit', function(code) {
    var error;
    if (code !== 0) {
      error = new Error(stderr);
      error.code = code;
    } else {
      error = null;
    }
    return callback(error, stdout);
  });
  return compiler.stdin.end(input);
};