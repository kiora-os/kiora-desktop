<template>
  <section class="control-panel">
    <clock></clock>
    <hr>
    <span class="button shutdown-button" @click="shutdown()">
      Shutdown
    </span>
  </section>
</template>

<script>
import clock from './clock.vue'

export default {
  name: 'control-panel',
  components: {
    clock
  },
  data() {
    return {}
  },
  mounted() {

  },
  methods: {
    shutdown() {
      this.$electron.ipcRenderer.send('shutdown');
    }
  }
}
</script>

<style scoped>
  .control-panel {
    position: absolute;
    text-align: center;
    right: 10vw;
    top: 10vw;
    width: 20vw;
    height: calc(100vh - 20vw);
    border-radius: 40px;
    background-color: rgba(50,50,50,0.5);
    backdrop-filter: blur(20px);
    user-select: none;
  }

  .control-panel .clock {
    display: block;
    display: inline-block;
    margin: 40px 0;
  }

  .control-panel hr {
    border: 0;
    border-top: 1px solid rgba(255,255,255,0.3)
  }

  .control-panel .shutdown-button {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%)
  }
</style>
