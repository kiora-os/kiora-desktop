<template>
  <div id="desktop-environment">
    <search :apps="files" :images="images" :gradients="gradients"></search>
    <app-buttons :apps="files" :images="images" :gradients="gradients"></app-buttons>
    <control-panel></control-panel>

    <!-- fixme -->
    <link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800,900&display=swap" rel="stylesheet">

  </div>
</template>

<script>
import controlPanel from './control-panel'
import search from './search'
import appButtons from './app-buttons'

import bytesToBase64 from './../utils/bytes2base64'



export default {
  name: 'desktop',
  data() {
    return {
      files: [],
      images: {},
      gradients: {}
    }
  },
  components: {
    'control-panel': controlPanel,
    'app-buttons': appButtons,
    search
  },
  mounted() {
    let self = this;
    this.$electron.ipcRenderer.on('desktopentries', (e, data) => {
      self.files = data;
    });

    this.$electron.ipcRenderer.on('gradients', (e, data) => {
      self.gradients = data;
    });

    this.$electron.ipcRenderer.on('icon', (e, data) => {

        let base64Data = bytesToBase64(data.data);
        this.images = {...this.images};
        this.images[data.app] = {};
        this.images[data.app].ext = data.ext;
        if (data.ext == 'svg') {
          this.images[data.app].src = atob(base64Data);
        } else {
          this.images[data.app].src = 'data:image/png;base64,' + base64Data;
        }

    })


  },

}
</script>

<style>
  html, body {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  #desktop-environment {
    font-family: 'Montserrat', sans-serif;
    width: 100%;
    height: 100%;
    background-color: #445059;
    background-image: url(~@/assets/wallpaper1.jpg);
    background-size: cover;
    background-position: center;
  }




  .button {
    display: inline-block;
    padding: 10px 20px;
    background-color: rgba(0,0,0,0.2);
    border-radius: 20px;
    color: #fff;
    cursor: pointer;
    transition: .3s;
  }

  .button:hover {
    background-color: rgba(0,0,0,0.4);
  }

</style>
