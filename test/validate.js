const path = require('path');
const util = require('util');
const assert = require('chai').assert;
const glob = require('glob');
const Ajv = require('ajv');
const schema = require('../docs/schema.json');
const loadSchema = require('./helpers').loadSchema;
const validJson = path.join( __dirname, 'fixtures', 'valid', '*.json' );
const invalidJson = path.join( __dirname, 'fixtures', 'invalid', '*.json' );
const inspectOptions = { showHidden: true, depth: null };

describe('Flash Briefing Skill API Feed', () => {
  let validate = null;

  before( done => {
    const ajv = new Ajv({
      loadSchema,
      extendRefs: 'fail',
    });

    ajv.addMetaSchema( require('ajv/lib/refs/json-schema-draft-04.json') );

    ajv.compileAsync(schema).then( func => {
      validate = func;
      done();
    }).catch(
      console.error.bind(console)
    );
  });

  describe('Valid JSON', () => {
    glob.sync(validJson).forEach( json => {
      it( path.basename(json), () => {
        const valid = validate( require(json) );
        assert.isTrue( valid, util.inspect( validate.errors, inspectOptions ) );
      });
    });
  });

  describe('Invalid JSON', () => {
    glob.sync(invalidJson).forEach( json => {
      it( path.basename(json), () => {
        const valid = validate( require(json) );
        assert.isFalse( valid, `${path.basename(json)} is valid, but shouldn't be` );
        assert.isAtLeast( validate.errors.length, 1 );
      });
    });
  });
});
