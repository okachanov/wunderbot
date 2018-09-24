import * as loader from 'convict';
import * as glob from 'glob';

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ silent: true });

let schema = {

  displayName: {
    doc: 'Displayed service name',
    default: 'Wunderbot',
    env: 'DISPLAY_NAME',
  },

  env: {
    doc: 'The application environment.',
    default: 'development',
    env: 'NODE_ENV',
  },

  db: {
    url: {
      doc: 'Connection string',
      default: '',
      env: 'DATABASE_URL',
    },
    host: {
      default: 'localhost',
      env: 'DATABASE_HOST',
    },
    port: {
      default: 5432,
      env: 'DATABASE_PORT',
    },
    user: {
      default: 'postgres',
      env: 'DATABASE_USER',
    },
    password: {
      default: 'postgres',
      env: 'DATABASE_PASSWORD',
    },
    name: {
      default: 'postgres',
      env: 'DATABASE_NAME',
    },

    cache: {
      enabled: {
        default: false,
        env: 'DATABASE_CACHE_ENABLED',
      },
    },

  },
};

const schemaPartialsFilesList: string[] = glob.sync(path.resolve(__dirname) + `/*/*config.?s`);

schemaPartialsFilesList.forEach(partialPath => {
  schema = Object.assign(schema, require(partialPath).default || {});
});

const config: any = loader(schema);

const configForCurrentEnvPartials: string[] = glob.sync(path.resolve(__dirname) + `*config.${config.get('env')}.json`);
config.loadFile(configForCurrentEnvPartials);

config.validate({allowed: 'strict'});

export { config };
