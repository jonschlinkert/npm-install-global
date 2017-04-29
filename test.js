'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var gm = require('global-modules');
var assert = require('assert');
var npm = require('./');

function isInstalled(name) {
  return fs.existsSync(path.resolve(gm, name));
}

describe('npm-install-global', function() {
  this.timeout(20000);

  before(function(cb) {
    if (!isInstalled('mocha')) {
      npm.install('mocha', cb);
    } else {
      cb();
    }
  });

  describe('api', function() {
    it('should export a function', function() {
      assert.equal(typeof npm, 'function');
    });

    it('should expose an `install` method', function() {
      assert(npm);
      assert.equal(typeof npm.install, 'function');
    });

    it('should expose an `uninstall` method', function() {
      assert(npm);
      assert.equal(typeof npm.uninstall, 'function');
    });

    it('should throw an error when invalid args are passed', function(cb) {
      try {
        npm();
        cb(new Error('expected an error'));
      } catch (err) {
        assert(err);
        assert.equal(err.message, 'expected callback to be a function');
        cb();
      }
    });
  });

  describe('.install', function() {
    it('should install a global npm package', function(cb) {
      npm.install('generate-foo', function(err) {
        if (err) return cb(err);
        assert(isInstalled('generate-foo'));
        npm.uninstall('generate-foo', cb);
      });
    });

    it('should install an array of global npm packages', function(cb) {
      npm.install(['generate-foo', 'generate-bar'], function(err) {
        if (err) return cb(err);
        assert(isInstalled('generate-foo'));
        assert(isInstalled('generate-bar'));
        cb();
      });
    });
  });

  describe('.uninstall', function() {
    it('should uninstall a global npm package', function(cb) {
      npm.uninstall('generate-foo', function(err) {
        if (err) return cb(err);
        assert(!isInstalled('generate-foo'));
        cb();
      });
    });

    it('should uninstall a global npm package', function(cb) {
      npm.uninstall(['generate-foo', 'generate-bar'], function(err) {
        if (err) return cb(err);
        assert(!isInstalled('generate-foo'));
        assert(!isInstalled('generate-bar'));
        cb();
      });
    });
  });

  describe('.maybeInstall', function() {
    it('should not install a package that already exists', function(cb) {
      npm.install('generate-foo', function(err) {
        if (err) return cb(err);

        npm.maybeInstall('generate-foo', function(err, names) {
          if (err) return cb(err);
          assert.equal(names.length, 0);
          assert(isInstalled('generate-foo'));
          cb();
        });
      });
    });

    it('should not install an array of packages that already exist', function(cb) {
      npm.install(['generate-foo', 'generate-bar'], function(err) {
        if (err) return cb(err);

        npm.maybeInstall(['generate-foo', 'generate-bar'], function(err, names) {
          if (err) return cb(err);
          assert.equal(names.length, 0);
          assert(isInstalled('generate-foo'));
          assert(isInstalled('generate-bar'));
          npm.uninstall(['generate-foo', 'generate-bar'], cb);
        });
      });
    });

    it('should install a package that does not exist', function(cb) {
      npm.maybeInstall(['generate-foo', 'generate-bar'], function(err, names) {
        if (err) return cb(err);
        assert.equal(names.length, 2);
        assert(isInstalled('generate-foo'));
        assert(isInstalled('generate-bar'));
        cb();
      });
    });

    it('should only install packages in an array if they do not exist', function(cb) {
      npm.uninstall(['generate-foo', 'generate-bar'], function(err) {
        if (err) return cb(err);

        npm.install(['generate-foo'], function(err) {
          if (err) return cb(err);

          assert(isInstalled('generate-foo'));
          assert(!isInstalled('generate-bar'));

          npm.maybeInstall(['generate-foo', 'generate-bar'], function(err, names) {
            if (err) return cb(err);

            assert.equal(names.length, 1);
            assert.equal(names[0], 'generate-bar');
            assert(isInstalled('generate-foo'));
            assert(isInstalled('generate-bar'));
            cb();
          });
        });
      });
    });
  });
});
