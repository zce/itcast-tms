/*
 * @Author: iceStone
 * @Date:   2016-01-07 21:31:54
 * @Last Modified by:   iceStone
 * @Last Modified time: 2016-01-08 00:08:51
 */

'use strict';

const path = require('path');
const fs = require('fs');

const academiesPath = path.join(__dirname, './academies.json');
const itcastPath = path.join(__dirname, './itcast.json');
const optionsPath = path.join(__dirname, './options.json');
const questionsPath = path.join(__dirname, './questions.json');
const schoolsPath = path.join(__dirname, './schools.json');
const subjectsPath = path.join(__dirname, './subjects.json');

exports.load = function() {
  return {
    academies: JSON.parse(fs.readFileSync(academiesPath, 'utf8')),
    itcast: JSON.parse(fs.readFileSync(itcastPath, 'utf8')),
    options: JSON.parse(fs.readFileSync(optionsPath, 'utf8')),
    questions: JSON.parse(fs.readFileSync(questionsPath, 'utf8')),
    schools: JSON.parse(fs.readFileSync(schoolsPath, 'utf8')),
    subjects: JSON.parse(fs.readFileSync(subjectsPath, 'utf8'))
  };
};

// module.exports = {
//   itcast, schools, academies, questions
// };

// for (let key in schools) {
//   let item = schools[key];
//   var academiesList = item.academies;
//   item.academies = {};
//   for (let i = 0; i < academiesList.length; i++) {

//   }
// }
