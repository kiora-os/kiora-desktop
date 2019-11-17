<template>
  <iframe class="svg-icon-frame" :id="'svg-icon-frame-'+uniqid" @load="loadSvg"/>
</template>

<script>
export default {
  name: 'svg-icon',
  props: ['content'],
  data: () => {
    return {
      uniqid: ''
    }
  },
  methods: {
    loadSvg() {
      let frame = document.querySelectorAll('#svg-icon-frame-'+this.uniqid)[0].contentWindow;
      frame.document.body.innerHTML = this.content;
      frame.document.body.style.overflow = 'hidden';
      frame.document.body.style.margin = 0;
    }
  },
  beforeMount() {
    this.uniqid = (new Date().getTime()).toString(16);
  }
}
</script>

<style scoped>
  .svg-icon-frame {
    border: 0;
    width: 48px;
    height: 48px;
    overflow: hidden;
  }
</style>
