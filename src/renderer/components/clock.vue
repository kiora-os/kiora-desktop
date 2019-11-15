<template>
  <div class="clock">
    <div class="time">
      {{time}}
    </div>
    <div class="date">
      {{date}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'clock',
  data() {
    return {
      time: '00:00:00',
      date: '00.00.0000'
    }
  },
  mounted() {
    setInterval(() => {
      let date = new Date();
      // date.getHour();
      this.time = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
      this.date = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth()+1)).slice(-2) + '.' + date.getFullYear()
    }, 100);
  }
}
</script>

<style scoped>
  .time,
  .date {
    font-size: 45px;
    color: #fff;
    text-shadow: 0 0 5px rgba(0,0,0,.2);
    font-weight: 100;
    letter-spacing: 1px;
  }
  .date {
    font-size: 20px;
    font-weight: 300;
  }
</style>
