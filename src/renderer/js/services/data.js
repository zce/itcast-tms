(function(angular, $) {
  'use strict';

  const files = {};

  angular.module('itcast-tms.services')
    .service('Data', [Data]);

  function Data() {
    Object.assign(files, {
      academies: $.path.join($.options.data_root, 'academies.json'),
      itcast: $.path.join($.options.data_root, 'itcast.json'),
      options: $.path.join($.options.data_root, 'options.json'),
      questions: $.path.join($.options.data_root, 'questions.json'),
      schools: $.path.join($.options.data_root, 'schools.json'),
      subjects: $.path.join($.options.data_root, 'subjects.json')
    });

    Object.keys(files).forEach(key => {
      this[key] = () => {
        return require(files[key]);
      };
    });
  }



}(angular, $));
