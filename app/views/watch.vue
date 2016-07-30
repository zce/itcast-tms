<style lang="less" scoped>
  .row {
    flex: 1;
  }
  .col-md-8,
  .col-md-4 {
    display: flex;
    flex-direction: column;
  }
  .scroll {
    overflow-y: auto;
    flex: 1;
  }
  .close {
    cursor: pointer;
  }
  .actions {
    margin-top: 5/16rem;
  }
</style>

<template>
  <div class="inner">
    <h1 class="page-header">测评信息监视</h1>
    <div class="row select">
      <div class="col-md-8">
        <div class="scroll">
          <table>
            <thead>
              <tr>
                <th width="30%">项目</th>
                <th width="70%">数据</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>学科信息</td>
                <td><span>{{ item.school_name }}</span> / <span>{{ item.academy_name }}</span> / <span>{{ item.subject_name }}</span></td>
              </tr>
              <tr>
                <td>评分时间</td>
                <td>{{ item.datetime }}</td>
              </tr>
              <tr>
                <td>评分班主任</td>
                <td>{{ item.head_name }}</td>
              </tr>
              <tr>
                <td>评分班级</td>
                <td>{{ item.class_name }}</td>
              </tr>
              <tr>
                <td>课程阶段</td>
                <td>{{ item.course_name }}</td>
              </tr>
              <tr>
                <td>课程天数</td>
                <td>{{ item.course_days }}天</td>
              </tr>
              <tr>
                <td>讲师姓名</td>
                <td>{{ item.teacher_name }}</td>
              </tr>
              <tr>
                <td>讲师邮箱</td>
                <td>{{ item.teacher_email }}</td>
              </tr>
              <tr>
                <td>班级总人数</td>
                <td>{{ item.class_count }}人（应到） - {{ item.leave_count }}人（请假） = {{ item.class_count - item.leave_count }}人（实到）</td>
              </tr>
              <tr>
                <td>已完成测评人数</td>
                <td style="color:#f40">{{ item.receives_count }}人（{{ item.class_count - item.leave_count - item.receives_count >= 0 ? '还少' + (item.class_count - item.leave_count - item.receives_count) : '超出' + -(item.class_count - item.leave_count - item.receives_count) }}人）</td>
              </tr>
              <tr v-if="item.status">
                <td>测评状态</td>
                <td style="color:#f60">{{ item.status }}</td>
              </tr>
              <tr v-if="item.status === $config.status_keys.rating">
                <td>测评链接</td>
                <td>
                  <a class="js-external-link" href="{{server_link + item.stamp}}">{{server_link + item.stamp}}</a>
                  <span>&nbsp;&nbsp;</span>
                  <a href="javascript:;" @click="copy(server_link + item.stamp)">点击复制</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-md-4">
        <div class="scroll">
          <table>
            <thead>
              <tr>
                <th width="35%">姓名</th>
                <th width="65%">邮箱</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in item.emails" track-by="$index">
                <td title="{{ i.name }}（{{ i.title }}）">{{ i.name }}</td>
                <td>{{ i.email }}</td>
              </tr>
              <tr style="color: #f70;" v-for="i in item.added_emails" track-by="$index">
                <td title="{{ i.name }}（{{ i.title }}）">{{ i.name }}</td>
                <td>{{ i.email }}<span class="close pull-right" title="移除{{ i.email }}" @click="del_email(i)">&times;&nbsp;&nbsp;</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <form v-if="item.status === $config.status_keys.rated" @submit="add_email($event)">
          <div class="input-group">
            <input class="field" type="text" v-model="email_input" placeholder="请输入额外添加的收件人">
            <button class="addon" type="submit">添加</button>
          </div>
        </form>
      </div>
    </div>
    <div class="actions">
      <button class="btn btn-primary btn-block btn-lg" v-if="item.status === $config.status_keys.initial" @click="start()">开始测评</button>
      <button class="btn btn-danger btn-block btn-lg" v-if="item.status === $config.status_keys.rating" @click="stop()">结束测评</button>
      <button class="btn btn-success btn-block btn-lg" v-if="item.status === $config.status_keys.rated" @click="send()">发送邮件</button>
      <div class="btn btn-default btn-block btn-lg" v-if="item.status === $config.status_keys.sending">邮件发送中......</div>
      <div class="btn btn-success btn-block btn-lg" v-if="item.status === $config.status_keys.send" @click="reveal($event)">邮件发送完成（可以删除左侧的记录文件，也可将文件拷出来备份）</div>
    </div>
  </div>
</template>

<script>
  import fs from 'fs'
  import path from 'path'
  import mail from '../libraries/mail'

  export default {
    data () {
      this.$root.$on('server_link_changed', () => {
        this.server_link = `http://${this.$root.server_address}:${this.$root.server_port}/`
      })
      return { item: {}, server_link: `http://${this.$root.server_address}:${this.$root.server_port}/`, email_input: '' }
    },

    route: {
      data (transition) {
        const stamp = transition.to.params.item
        this.loadData(stamp)
        this.$storage.watch(stamp, () => this.loadData(stamp))
      }
    },

    methods: {
      // 加载数据
      loadData (stamp) {
        if (!stamp) return this.$router.go({ name: 'start' })
        const item = this.$storage.get(stamp)
        // console.log(JSON.stringify(item, null, 2))
        if (!item) {
          alert('没有对应的测评信息！\n请重新创建')
          return this.$router.go({ name: 'start' })
        }
        this.item = item
        this.$root.title = stamp
        return this.item
      },
      // 操作剪切板
      copy (txt) {
        this.$electron.clipboard.writeText(txt)
        alert('已经将打分链接复制到剪切板\n请将链接发送给学生')
      },
      // 保存当前数据状态
      save () {
        this.$storage.set(this.item.stamp, this.item)
      },
      // 添加新邮箱
      add_email (e) {
        if (!this.email_input) return false
        this.email_input.includes('@') || (this.email_input += '@itcast.cn')
        this.item.added_emails.push({ name: '手动添加', title: '系统', email: this.email_input })
        this.email_input = ''
        this.save()
        e.preventDefault()
      },
      // 删除添加的邮箱
      del_email (item) {
        this.item.added_emails.splice(this.item.added_emails.indexOf(item), 1)
        this.save()
      },
      // 开始评测按钮
      start () {
        // 当前状态为初始状态
        if (this.item.status === this.$config.status_keys.initial) {
          this.item.status = this.$config.status_keys.rating
          this.save()
        }
      },
      // 结束评测按钮
      stop () {
        if (this.stoping) return
        // 防止多次点击
        this.stoping = true
        this.item.receives_count = Object.keys(this.item.receives).length
        if (!this.item.receives_count) {
          this.stoping = false
          return alert('尚未有人提交测评表单！')
        }
        if (!(confirm('确定结束吗？') && confirm('真的确定结束吗？'))) {
          this.stoping = false
          return
        }
        // 当前状态为正在测评
        if (this.item.status === this.$config.status_keys.rating) {
          // 测评完成状态
          this.item.status = this.$config.status_keys.rated
          this.save()
          this.stoping = false
        }
      },
      // 发送邮件按钮
      send () {
        if (this.sending) return
        // 防止多次点击
        this.sending = true
        // console.log(this.item)
        if (!(confirm('确定发送邮件吗？'))) {
          this.sending = false
          return
        }
        if (this.item.status === this.$config.status_keys.rated) {
          this.item.status = this.$config.status_keys.sending
          this.save()
          setTimeout(() => {
            // 发送邮件
            mail(this.item)
              .then(message => {
                this.item.status = this.$config.status_keys.send
                this.save()
                this.sending = false
              })
              .catch(error => {
                // $.logger.fatal(error)
                if (error.code === 'ENOTFOUND' && error.syscall === 'getaddrinfo') {
                  alert('网络连接失败，请确认网络正常')
                } else if (error.responseCode === 550 && error.code === 'EENVELOPE') {
                  alert(`收件人错误（不存在）
          请将本次打分的记录文件「${this.item.stamp}${this.$config.storage_ext}」
          发送到「wanglei3@itcast.cn」`)
                } else if (error.responseCode === 598) {
                  alert(`邮件中包含违禁词，发送失败
          请将本次打分的记录文件「${this.item.stamp}${this.$config.storage_ext}」
          发送到「wanglei3@itcast.cn」`)
                } else {
                  alert(error)
                  alert('邮件发送失败\n请联系「wanglei3@itcast.cn」')
                }
                // 测评完成状态
                this.item.status = this.$config.status_keys.rated
                this.save()
                this.sending = false
              })
          }, 0)
        }
      },
      // 找到文件
      reveal (e) {
        e.preventDefault()
        const source = this.$storage.getPath(this.item.stamp)
        this.$electron.remote.dialog.showSaveDialog({
          title: `备份测评详细记录`,
          filters: [
            { name: '测评数据', extensions: ['dat'] }
          ],
          defaultPath: path.join(this.$electron.remote.app.getPath('desktop'), `${this.item.class_name}（${this.item.datetime.replace(/(:|\/|\\|\s)/g, '-')}）${this.$config.storage.ext}`)
        }, target => {
          if (!target) return
          fs.readFile(source, (err, data) => {
            if (err) {
              alert('拷贝失败，请手动拷贝!')
              this.$electron.shell.showItemInFolder(source)
            }
            fs.writeFile(target, data, () => this.$electron.shell.showItemInFolder(target))
          })
        })
      }
    }
  }
</script>
