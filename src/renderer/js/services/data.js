(function(angular) {
  'use strict';

  const fs = window.require && require('fs');
  const path = window.require && require('path');

  const files = {};

  angular.module('itcast-tms.services')
    .service('Data', ['options', Data]);

  function Data(options) {
    this.options = options;
    Object.assign(files, {
      academies: path.join(this.options.data_root, 'academies.json'),
      itcast: path.join(this.options.data_root, 'itcast.json'),
      options: path.join(this.options.data_root, 'options.json'),
      questions: path.join(this.options.data_root, 'questions.json'),
      schools: path.join(this.options.data_root, 'schools.json'),
      subjects: path.join(this.options.data_root, 'subjects.json')
    });

    Object.keys(files).forEach(key => {
      this[key] = () => {
        return require(files[key]);
      };
    });
  }



}(angular));
