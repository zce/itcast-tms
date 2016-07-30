<style scoped>
  div {
    align-items: center;
    justify-content: center;
  }
  img {
    width: 265px;
  }
  .rotate {
    transition: transform .5s ease-in-out
  }
  .rotate:hover {
    transform: rotate(360deg);
  }
  p {
    line-height: 24px;
  }
  a {
    color: #fff;
    text-decoration: none;

    &:hover { color: #fff; }
  }
  ul {
    list-style-type: none;
    margin-top: 10px;
    padding: 0;
  }
  li {
    display: inline-block;
  }
</style>

<template>
  <div class="inner">
    <img src="../assets/img/itcast.svg" alt="itcast" :class="{rotate: rotate}" @dblclick="addRotate()">
    <h1>{{$config.app.name}}</h1>
    <p>{{$t('dashboard.intro')}}</p>
    <ul>
      <li><a v-link="{ name: 'start' }" class="btn btn-warning btn-lg">{{$t('dashboard.start')}}</a></li>
    </ul>
    <p>{{$t('dashboard.copyright')}}</p>
  </div>
</template>

<script>
  export default {
    name: 'dashboard',
    components: {},
    data () {
      return { click: 0, rotate: false }
    },
    methods: {
      addRotate () {
        this.click++
        if (this.click > 2) {
          this.click = 0
          this.rotate = !this.rotate
        }
      }
    }
  }
</script>
