var db = require('./../db_actions');
var sync = jxcore.utils.cmdSync;
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');

var eopts = {
  encoding: 'utf8',
  timeout: 0,
  maxBuffer: 1e9,
  killSignal: 'SIGTERM'
};

var createBranch = function (branch_name, cb) {
  exec("cd " + process.cwd() + "/reporting;chmod +x ./push_logs.sh;./push_logs.sh " + branch_name,
    eopts, function (err, stdout, stderr) {
      cb(err, stdout + "\n" + stderr);
    });
};

// this needs to be syched!
// why ? we don't want any other test worker write in between
exports.logIntoBranch = function (branch_name, filename, log, cb, skip) {
  if(skip && skip !== -1) {
    fs.writeFileSync(process.cwd() + '/TestResults/' + filename, log);
    cb(null);
    return;
  }

  logme("Creating Github Gist", "red");

  createBranch(branch_name, function (err, res) {
    if (err) {
      cb(err, res);
      return;
    }

    if (skip !== -1)
      fs.writeFileSync(process.cwd() + '/TestResults/' + filename, log);

    exec("cd " + process.cwd()
      + "/reporting;chmod +x ./commit_logs.sh;./commit_logs.sh " + branch_name, eopts,
      function (err, stdout, stderr) {
        if (err) {
          cb(err, stdout + "\n" + stderr);
        } else {
          cb(null);
        }
      });
  });
};