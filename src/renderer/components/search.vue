<template>
  <section class="search">
    <input type="text" name="" value="" v-model="searchQuery" class="search__bar" placeholder="Search…">
    <div class="search__results" :class="(searchQuery.length > 0) ? 'search__results--shown' : ''">
      <div class="search__results__apps">
        <div class="search__results__title">Apps</div>
        <span v-for="(app, key) in queriedApps">
          <span class="search__result" tabindex="0" @click="openApp(key)" @keypress.enter="openApp(key)">
            <img v-if="images[key] && images[key].ext != 'svg'" :src="images[key].src" alt="" class="search__result__app-icon"> {{app.name}}<br>
          </span><br>
        </span>
      </div>
      <!-- <div class="search__results__files"></div> -->
      <div class="search__results__web">
        <div class="search__results__title">Web Search</div>
        <div class="search__results__area">
          <span class="search__result" @click="webSearch(searchQuery)" @keypress.enter="webSearch(searchQuery)" tabindex="0">
            Search for "{{searchQuery}}" on the web
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import $ from 'jquery';

export default {
  name: 'search',
  props: [
    'apps',
    'images',
    'gradients'
  ],
  data() {
    return {
      searchQuery: ''
    }
  },
  mounted() {
    
  },
  methods: {
    webSearch(query) {
      this.$electron.ipcRenderer.send('websearch', query);
    },
    openApp(appName) {
      this.$electron.ipcRenderer.send('open:app', appName);
    }
  },
  computed: {
    queriedApps() {

      let appPage = 0,
          queriedApps = {},
          i = 0;

      for (let appKey in this.apps) {
        let app = this.apps[appKey];


        if (app && app.name &&
            app.exec &&
            !app.hidden &&
            app.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) >= 0) {

            queriedApps[appKey] = app;
            i++
            if (i >= 5) {
              return queriedApps;
            }
          }
      }

      return queriedApps;

    }
  }
}
</script>

<style scoped>

  .search {
    position: absolute;
    width: calc(100% - 20vw - 25vw - 121px);
    left: calc(10vw + 20px);
    top: 10vw;
    z-index: 100;
  }

  .search__bar {
    position: relative;
    width: 100%;
    padding: 15px 30px;
    background: linear-gradient(#fff 0%, #D4D4D4 100%);
    border: 0;
    border-radius: 30px;
    outline: 0;
    font-size: 16px;
    box-sizing: border-box;
    z-index: 2;
    transition: .3s;
  }

  .search__bar:focus {
    box-shadow: 0 5px 5px  rgba(0,0,0,.25);
  }

  .search__results {
    --half-search__bar: calc((1em + 30px) / 2);
    display: none;

    position: absolute;
    left: 0;
    top: var(--half-search__bar);
    width: 100%;
    padding: 40px;
    padding-top: calc(var(--half-search__bar) + 40px);
    background-color: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(20px);
    border-radius: 0 0 20px 20px;
    box-sizing: border-box;
  }

  .search__results--shown {
    display: block;
  }

  .search__results__title {
    width: 100%;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(0,0,0,.2);
  }

  .search__result {
    display: inline-flex;
    align-items: center;
    padding: 5px 10px;
    background-color: rgba(255,255,255,0.3);
    border-radius: 8px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: .3s;
  }

  .search__result:hover,
  .search__result:focus {
    background-color: rgba(255,255,255,0.6);
    margin-left: 10px;
    outline: none;
  }

  .search__result__app-icon {
    width: 24px;
    height: auto;
    margin-right: 10px;
  }
</style>
