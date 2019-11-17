<template>
  <section class="app-buttons-wrapper">
    <section class="app-buttons">
      <div class="app-page" v-for="appPage in queriedApps">
        <span class="app-button" v-for="(app, key) in appPage" @click="openApp(key)" :data-name="key">
          <span class="app-button__icon">
            <img v-if="images[key] && images[key].ext != 'svg'" :src="images[key].src" alt="" class="app-button__logo" @load="drawGradient">
            <span v-else-if="images[key]" class="app-button__logo app-button__logo--svg"><svg-icon :content="images[key].src"></svg-icon></span>

          </span>
          <span class="app-button__title">
            {{app.name}}
          </span>
        </span>
      </div>
    </section>
  </section>
</template>

<script>
import averageColorFromImage from './../utils/averageColor'
import $ from 'jquery'
import 'slick-carousel'
import svgIcon from './svg-icon'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default {
  name: 'app-buttons',
  data() {
    return {

    }
  },
  components: {
    'svg-icon': svgIcon
  },
  mounted() {
    // FIXME
    setTimeout(() => {
      $('.app-buttons').slick({
        slidesToShow: 1,
        dots: true,
        arrows: false
      });

    }, 1000);

    $('.app-buttons').on('mousewheel', (e) => {
      if (e.originalEvent && e.originalEvent.deltaY && e.originalEvent.deltaY >= 0) {
        $('.app-buttons').slick('next');
      } else {
        $('.app-buttons').slick('prev');
      }
    })
  },
  props: ['apps','images','gradients'],
  methods: {
    openApp(appName) {
      // alert(file);
      this.$electron.ipcRenderer.send('open:app', appName);
    },

    drawGradient(e) {
      let appKey;
      if (e.path[2]) {
        appKey = e.path[2].getAttribute('data-name').replace('.desktop', '');
      }

      if (e.path[2] && appKey && this.gradients[appKey]) {
        // found gradient
        let gradientConfig = this.gradients[appKey];
        if (gradientConfig[0] && gradientConfig[1]) {
          let gradient = 'linear-gradient(-45deg,'+gradientConfig[1]+' 0%, '+gradientConfig[0]+' 100%)';
          if (e.path[1]) e.path[1].style.background = gradient;
        }

      } else {
        // generate gradient

        let rgb = averageColorFromImage(e.path[0]);

        let change = 65;
        let primaryColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
        let secondaryColor;


        if ((rgb.r+rgb.g+rgb.b) >= 383) {
          // Color is light: make secondary dark
          secondaryColor = 'rgb('+(rgb.r-change)+','+(rgb.g-change)+','+(rgb.b-change)+')';
        } else {
          // Color is dark: make secondary light
          secondaryColor = 'rgb('+(rgb.r+change)+','+(rgb.g+change)+','+(rgb.b+change)+')';
        }

        let gradient = 'linear-gradient(-45deg,'+primaryColor+' 0%, '+secondaryColor+' 100%)';

        if (e.path[1]) e.path[1].style.background = gradient;
      }


    }
  },
  computed: {
    queriedApps() {

      let appPage = 0,
          queriedApps = {},
          i = 0,
          appsOnPage = 12;

      queriedApps[appPage] = {};

      for (let appKey in this.apps) {
        let app = this.apps[appKey];

        if (i >= appsOnPage) {
          appPage++;
          i=0;
          queriedApps[appPage] = {};
        }

        if (app && app.name &&
            app.exec &&
            !app.hidden) {

            queriedApps[appPage][appKey] = app;
            i++
          }
      }

      return queriedApps;

    }
  }
}
</script>

<style>
  .app-buttons-wrapper {
    display: block;
    width: calc(100vw - 20vw - 10vw - 20vw);
    top: calc(10vw + 120px);
    left: 10vw;
    position: absolute;
  }

  .app-page {
    display: grid !important;
    grid-template-columns: auto auto auto auto;
    justify-content: space-between;
  }

  .app-buttons::-webkit-scrollbar {
    display: none;
  }

  .app-button {
    display: inline-block;
    margin-bottom: 70px;
    width: 120px;
    height: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .app-button__icon {
    position: relative;

    font-size: 15px;
    display: block;
    border-radius: 20px;
    margin: 0 auto 10px;

    width: 48px;
    height: 48px;
    padding: 15px;
    overflow: hidden;

    background: linear-gradient(-45deg, #bbdada 0%, #c3c3c3 100%);

    box-shadow: 0 0 5px rgba(0,0,0,0.2);
    transition: .3s;
  }

  .app-button .app-button__icon::before {
    content: '';
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    transition: .3s;
  }

  .app-button__logo,
  .app-button__logo--svg svg {
    width: 48px;
    height: auto;
  }

  .app-button__title {
    display: inline-block;
    width: 100%;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    text-shadow: 0 0 5px rgba(0,0,0,0.5);
    text-align: center;
  }


  .app-button:hover .app-button__icon {
    box-shadow: 0 5px 5px rgba(0,0,0,.25);
  }

  .app-button:hover .app-button__icon::before {
    background-color: rgba(255,255,255,.1);
  }

  .slick-dots {
    bottom: 0;
  }

  .slick-dots li button::before {
    font-size: 12px;
    color: #fff;
  }

  .slick-dots li.slick-active button:before {
    color: #fff;
  }
</style>
