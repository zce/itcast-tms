<style lang="less" scoped>
  .scroll {
    overflow-y: auto;
    flex: 1;
  }
  .actions {
    margin-bottom: 5/16rem;
  }
</style>

<template>
  <div class="inner">
    <h1 class="page-header">创建新的测评记录</h1>
    <div class="row scroll">
      <div class="col-md-6">
        <div class="form-group">
          <label for="school_name">所属校区</label>
          <select id="school_name" v-model="item.school_name" lazy>
            <option value="{{* key }}" v-for="(key, value) in data.schools" track-by="$index">{{* key }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="academy_name">所属学院</label>
          <select id="academy_name" v-model="item.academy_name" lazy>
            <option value="{{* key }}" v-for="(key, value) in data.academies" track-by="$index">{{* key }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="subject_name">所属学科</label>
          <select id="subject_name" v-model="item.subject_name" lazy>
            <option value="{{* s.name }}" v-for="s in data.subjects">{{* s.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="class_count">班级总人数</label>
          <input type="number" id="class_count" v-model="item.class_count" lazy number placeholder="请输入班级总人数" min="0" max="200">
        </div>
        <div class="row">
          <div class="col-sm-4 form-group" v-for="(key, value) in item.reasons" track-by="$index">
            <label for="reason{{* $index }}_count">{{* key }}人数</label>
            <input type="number" id="reason{{* $index }}_count" v-model="item.reasons[key]" lazy number placeholder="请输入{{* key }}人数" min="0" max="50" tabindex="-1">
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for="head_name">班主任姓名</label>
          <input type="text" id="head_name" v-model="item.head_name" lazy placeholder="请输入班主任姓名">
        </div>
        <div class="form-group">
          <label for="class_name">班级名称</label>
          <input type="text" id="class_name" v-model="item.class_name" lazy placeholder="分校名+品牌+学科名+班级类型+期数（时间+授课模式）">
        </div>
        <div class="form-group">
          <label for="course_name">课程阶段</label>
          <input type="text" id="course_name" v-model="item.course_name" lazy placeholder="请输入课程阶段">
        </div>
        <div class="form-group">
          <label for="course_days">课程天数</label>
          <input type="number" id="course_days" v-model="item.course_days" lazy number placeholder="请输入课程天数" min="0" max="50">
        </div>
        <div class="form-group">
          <label for="teacher_name">讲师姓名</label>
          <input type="text" id="teacher_name" v-model="item.teacher_name" lazy placeholder="请输入讲师名称">
        </div>
        <div class="form-group">
          <label for="teacher_email">讲师邮箱</label>
          <input type="text" id="teacher_email" v-model="item.teacher_email" lazy placeholder="请输入讲师邮箱">
        </div>
        <div class="form-group">
          <label for="datetime">测评日期</label>
          <input type="text" id="datetime" v-model="item.datetime" lazy readonly="readonly" tabindex="-1">
        </div>
      </div>
    </div>
    <div class="actions">
      <button class="btn btn-primary btn-lg btn-block" @click="submit()">创建新的测评</button>
    </div>
  </div>
</template>

<script>
  export default {
    ready () {
      this.$root.title = '创建新的测评'
      this.$watch('item.school_name', this.showSubjects, { immediate: true })
      this.$watch('item.academy_name', this.showSubjects)
    },

    data () {
      const vm = {}
      vm.item = {
        school_name: '',
        academy_name: '',
        subject_name: '',
        class_count: 0,
        reasons: { 留级: 0, 病假: 0, 事假: 0, 回学校: 0, 已就业: 0, 其他教室自习: 0, 在家复习: 0, 不想听课: 0, 其他: 0 },
        class_name: '',
        course_name: '',
        course_days: 0,
        head_name: '',
        teacher_name: '',
        teacher_email: '',
        datetime: this.$utils.formatDate(new Date(), 'yyyy-MM-dd HH:mm')
      }

      // ===== 读取配置文件 =====
      vm.data = {}
      vm.data.schools = this.$db.schools
      vm.data.schools && (vm.item.school_name = Object.keys(vm.data.schools)[0])
      vm.data.academies = this.$db.academies
      vm.data.academies && (vm.item.academy_name = Object.keys(vm.data.academies)[0])
      vm.data.subjects = []

      return vm
    },

    methods: {
      // 校区和学院改变 → 学科对应变化
      showSubjects () {
        let temp = this.$db.subjects.filter(s => s.academy === this.item.academy_name && s.school === this.item.school_name)
        temp.length || (temp = [{name: '暂无对应学科'}])
        this.data.subjects = temp
        this.item.subject_name = this.data.subjects[0].name
        // TODO: ? track-by
        // setTimeout(() => {
        //  this.item.subject_name = this.data.subjects[0].name
        // }, 0)
      },

      submit () {
        const temp = Object.assign({}, this.item)

        // ====================================================
        // ====================== 数据校验 =====================
        // ====================================================
        for (let key in temp) {
          let item = temp[key]
          item.trim && (item = item.trim())
          if (!item) return alert('请完整填写所有信息！')
          this.item[key] = temp[key] = item
        }

        // 学科选择
        if (temp.subject_name === '暂无对应学科') {
          return alert('请正确选择学科信息！')
        }

        // 当前选择的校区、学院、学科信息
        const school = this.$db.schools[temp.school_name]
        const academy = this.$db.academies[temp.academy_name]
        const subject = this.$db.subjects.find(s => s.academy === temp.academy_name && s.school === temp.school_name && s.name === temp.subject_name)
        if (!(school && academy && subject)) {
          return alert('请确认选择校区、学院、学科信息！')
        }

        // 班级名称格式
        if (!/^.+?(传智|黑马).+?(基础|就业)\d{1,5}期（\d{8}(面授|双元)）\s?$/.test(temp.class_name)) {
          // 分校名+品牌+学科名+班级类型+期数（时间+授课模式），
          // 例如：北京传智JavaEE基础88期（20160608面授）
          // return alert('请输入正确格式的班级名称\n例如：北京传智JavaEE基础88期（20160608面授）')
          if (!confirm('建议输入正确格式的班级名称\n例：北京传智PHP基础88期（20160808面授）\n忽略请点击确认，修改请点击取消')) {
            return
          }
        }

        // ====================================================
        // ==================== 额外数据计算 ====================
        // ====================================================
        // 请假人数
        temp.leave_count = (() => {
          let result = 0
          for (let key in temp.reasons) {
            result += temp.reasons[key]
          }
          return result
        })()

        // 测评信息
        // { ip: { marks: { 2015: {}, 2016: {} }, note: '' } }
        temp.receives = {}
        // 已经测评人数
        temp.receives_count = 0

        // 测评记录状态初始化
        temp.status = this.$config.status_keys.initial

        // 本次测评问题
        let ruleKeys = subject.rules && subject.rules.length ? subject.rules : academy.rules && academy.rules.length ? academy.rules : school.rules && school.rules.length ? school.rules : this.$db.root.rules
        if (!(ruleKeys && ruleKeys.length)) {
          // TODO: error log
          return alert(`【${temp.school_name} / ${temp.academy_name} / ${temp.subject_name}】 没有题目信息`)
        }
        temp.rules = {}
        ruleKeys.forEach(k => { temp.rules[k] = this.$db.rules[k] })

        // 处理邮箱后缀
        temp.teacher_email.includes('@') || (temp.teacher_email += '@itcast.cn')

        // 本次测评的收件人列表
        temp.emails = this.$db.root.emails.concat(school.emails, academy.emails, subject.emails)

        // 手动添加的收件人
        temp.added_emails = []

        // 获取一个戳
        temp.stamp = this.$utils.getStamp()

        // 持久化存储
        this.$storage.set(temp.stamp, temp)

        // 跳转到监视页面
        this.$router.go({ name: 'watch', params: { item: temp.stamp } })
      }
    }
  }
</script>
