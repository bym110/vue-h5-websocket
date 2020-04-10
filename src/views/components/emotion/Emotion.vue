<template>
  <div class="ly-emotion" >
    <slot></slot>
  </div>
</template>

<script>
    import list from '../../../libs/emojiList'
  export default {
    name: 'ly-emotion',
    mounted () {
      const name = this.$el.innerHTML
      let index = list.indexOf(name)
       if (index !== 105 && index>=0 ) {
           let imgHTML=`<img src=`+require(`../../../assets/wx/${index}.png`)+` alt="">`
           this.$nextTick(() => {
               this.$el.innerHTML = imgHTML
           })
       }
    }
  }
</script>
<style scoped>
  .ly-emotion {
    display: inline-block;
    margin-bottom: .3em;
  }
  .ly-static-emotion {
    width: 24px;
    height: 24px;
    display: inline-block;
  }
</style>
