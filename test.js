'use strict';

require('mocha');
var path = require('path');
var gm = require('global-modules');
var exists = require('fs-exists-sync');
var assert = require('assert');
var npm = require('./');

describe('npm-install-global', function() {
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

  it('should install a global npm package', function(cb) {
    // test package for https://github.com/generate/generate
    npm.install('generate-foo', function(err) {
      if (err) return cb(err);
      assert(exists(path.resolve(gm, 'generate-foo')));
      cb();
    });
  });

  it('should uninstall a global npm package', function(cb) {
    // test package for https://github.com/generate/generate
    npm.uninstall('generate-foo', function(err) {
      if (err) return cb(err);
      assert(!exists(path.resolve(gm, 'generate-foo')));
      cb();
    });
  });

  it('should install an array of global npm packages', function(cb) {
    // test packages for https://github.com/generate/generate
    npm.install(['generate-foo', 'generate-bar'], function(err) {
      if (err) return cb(err);
      assert(exists(path.resolve(gm, 'generate-foo')));
      assert(exists(path.resolve(gm, 'generate-bar')));
      cb();
    });
  });

  it('should uninstall a global npm package', function(cb) {
    // test packages for https://github.com/generate/generate
    npm.uninstall(['generate-foo', 'generate-bar'], function(err) {
      if (err) return cb(err);
      assert(!exists(path.resolve(gm, 'generate-foo')));
      assert(!exists(path.resolve(gm, 'generate-bar')));
      cb();
    });
  });
});
