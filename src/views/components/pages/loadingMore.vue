<template>
  <div class="parent-box" ref="parentBox">
    <group :style="{marginTop:marginTop+'em',animation:animation}" :class="className">
      <load-more :tip="text"></load-more>
      <slot></slot>
    </group>
  </div>
</template>

<script>
    import { Group, Cell,LoadMore } from 'vux'
    export default {
        name: "loadingMore",
        props:{
            className:String,
            text:String,
            pageSize:Number
        },
        components:{
            Group,
            Cell,
            LoadMore
        },
        data() {
            return {
                marginTop: -4,
                animation:'',
                delta:{ // 触摸屏幕时的偏移
                    x:0,
                    y:0,
                },
                moveDelta:{ // 触摸移动的偏移
                    x:0,
                    y:0,
                }
            }
        },
        methods:{
            ontouchstart() {
                let dom = this.$refs.parentBox;
                dom.ontouchstart = (e)=>{
                    this.delta.x = e.touches[0].pageX;
                    this.delta.y = e.touches[0].pageY;
                }

            },
            ontouchmove() {
                let dom = this.$refs.parentBox;
                dom.ontouchmove = (e)=>{
                    this.moveDelta.x = e.changedTouches[0].pageX;// x偏移量 判断左滑右滑
                    this.moveDelta.y = e.changedTouches[0].pageY; // y偏移量 判断上滑下滑
                    if (this.moveDelta.y > this.delta.y) { // 当下滑的时候
                        if (dom.scrollTop === 0) {
                            this.animation ='';
                            if (this.marginTop < 0) {
                                this.marginTop += 0.2;
                            }
                        }
                    }

                }
            },
            ontouchend() {
                let dom = this.$refs.parentBox;
                dom.ontouchend = (e)=>{
                    if (Math.abs(this.moveDelta.y) - Math.abs(this.delta.y) >20 ) { // 当下滑的时候
                        if (dom.scrollTop === 0) {
                            this.animation = 'mymove 1s';
                            this.marginTop = -4;
                            this.$emit('moveEvent');

                        }

                    } else {
                        this.marginTop = -4;
                    }

                }

            },
        },
        mounted() {
            this.ontouchstart()
            this.ontouchmove();
            this.ontouchend();
        }
    }
</script>

<style lang="less">
  .parent-box {
    height: 100%;
    overflow: auto;
    @keyframes mymove
    {
      from {margin-top:0;}
      to {margin-top:-4em;}
    }

    @-webkit-keyframes mymove /*Safari and Chrome*/
    {
      from {margin-top:0;}
      to {margin-top:-4em;}
    }
  }

</style>
