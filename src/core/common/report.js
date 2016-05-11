const storage = require('./storage')

function getNotes (data) {
  const notes = []
  for (let key in data.rated_info) {
    data.rated_info[key].note && data.rated_info[key].note.trim() && notes.push(data.rated_info[key].note.trim())
  }
  return notes
}

function getResult (data) {
  const result = {}
  for (let v in data.rules) {
    const rule = data.rules[v]
    result[v] = { scores: {} }
    // 每一版本的结果 键为题目简称
    for (let t = 0; t < rule.questions.length; t++) {
      // 遍历每一题
      let frontTotal = 0
      for (let ip in data.rated_info) {
        const rated = data.rated_info[ip]
        rated.marks[v] && rated.marks[v][t] && (frontTotal += rated.marks[v][t].front)
      }
      result[v].scores[rule.questions[t].shortname] = parseFloat((frontTotal / data.rated_count).toFixed(2))
    }
    let minimumBackTotal = 100
    let allBackTotal = 0
    for (let ip in data.rated_info) {
      const rated = data.rated_info[ip]
      rated.backTotal = 0
      for (let t = 0; t < rule.questions.length; t++) {
        rated.marks[v] && rated.marks[v][t] && (rated.backTotal += rated.marks[v][t].back)
      }
      allBackTotal += rated.backTotal
      if (minimumBackTotal > rated.backTotal) {
        minimumBackTotal = rated.backTotal
      }
    }
    result[v].backTotal = parseFloat((allBackTotal / data.rated_count).toFixed(2))
    result[v].backTotalWithoutMin = parseFloat(((allBackTotal - minimumBackTotal) / (data.rated_count - 1)).toFixed(2)) || '参与人数过少'
  }
  return result
}

module.exports = (data) => {
  // const data = storage.get(stamp)
  // data.rated_count = Object.keys(data.rated_info).length
  const notes = getNotes(data)
  const result = getResult(data)
  Object.assign(data, { notes, result })
  // data.status = options.status_keys.rated
  storage.set(data.stamp, data)
  return data
}
