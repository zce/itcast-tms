import { set } from './storage'

function getNotes (data) {
  const notes = []
  for (let key in data.receives) {
    data.receives[key].note && data.receives[key].note.trim() && notes.push(data.receives[key].note.trim())
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
      for (let ip in data.receives) {
        const rated = data.receives[ip]
        rated.marks[v] && rated.marks[v][t] && (frontTotal += rated.marks[v][t].front)
      }
      result[v].scores[rule.questions[t].shortname] = parseFloat((frontTotal / data.receives_count).toFixed(2))
    }
    let minimumBackTotal = 100
    let allBackTotal = 0
    for (let ip in data.receives) {
      const rated = data.receives[ip]
      rated.backTotal = 0
      for (let t = 0; t < rule.questions.length; t++) {
        rated.marks[v] && rated.marks[v][t] && (rated.backTotal += rated.marks[v][t].back)
      }
      allBackTotal += rated.backTotal
      if (minimumBackTotal > rated.backTotal) {
        minimumBackTotal = rated.backTotal
      }
    }
    result[v].backTotal = parseFloat((allBackTotal / data.receives_count).toFixed(2))
    result[v].backTotalWithoutMin = parseFloat(((allBackTotal - minimumBackTotal) / (data.receives_count - 1)).toFixed(2)) || '参与人数过少'
  }
  return result
}

export default (data) => {
  // const data = storage.get(stamp)
  // data.receives_count = Object.keys(data.receives).length
  const notes = getNotes(data)
  const result = getResult(data)
  Object.assign(data, { notes, result })
  // data.status = options.status_keys.rated
  set(data.stamp, data)
  return data
}
