const os = require('os');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const request = require('request');
const packageName = require('../package.json').name;

function md5( data )
{
  return crypto.createHash('md5').update(data).digest('hex');
}

function ensureTmpDirExists()
{
  const tmpDir = path.join( os.tmpdir(), packageName );

  return fs.ensureDir( tmpDir ).then( () => tmpDir );
}

function loadSchema( uri )
{
  return new Promise( async (resolve, reject) => {
    try {
      const dir = await ensureTmpDirExists();
      const hashedPath = path.join( dir, md5( uri ) );
      const localSchemaExists = await fs.pathExists( hashedPath );

      if ( localSchemaExists ) {
        fs.readJson( hashedPath ).then( resolve, reject );
      } else {
        request( uri ).pipe( fs.createWriteStream( hashedPath ) ).on('finish', () => {
          fs.readJson( hashedPath ).then( resolve, reject );
        });
      }
    } catch ( error ) {
      reject( error );
    }
  });
}

module.exports = {
  md5,
  ensureTmpDirExists,
  loadSchema,
};
