const { join } = require('path');
const options = require('../config');

const files = {};
Object.assign(files, {
  academies: join(options.data_root, 'academies.json'),
  itcast: join(options.data_root, 'itcast.json'),
  options: join(options.data_root, 'options.json'),
  questions: join(options.data_root, 'questions.json'),
  schools: join(options.data_root, 'schools.json'),
  subjects: join(options.data_root, 'subjects.json')
});

Object.keys(files).forEach(key => {
  exports[key] = () => {
    return require(files[key]);
  };
});
