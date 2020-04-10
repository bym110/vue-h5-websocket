<template>
  <div class="groupList">
    <template v-if="groupList.length">
      <group>
        <template v-for="item in groupList">
          <cell @click.native="handleClick(item)">
            <div slot="title">
              <img class="avatar" :src="$avatarFormatter(item.groupHeaderPic,true)" alt="">
              <div class="allTitle">
                <span class="title" v-html="item.groupName"></span>
                <span class="subTitle">所属微信：{{item.staffImNickName}}</span>
              </div>
            </div>
          </cell>
        </template>
      </group>
      <div class="totalTip">共{{ groupTotal }}个微信群</div>
    </template>
    <template v-else>
      <div class="showNull" v-html="showNullText"></div>
    </template>
  </div>
</template>

<script>
    import { Group, Cell } from 'vux'
    export default {
        name: "groupList",
        props:{
          searchKey:String
        },
        components:{
            Group,
            Cell
        },
        data() {
            return {
                groupList:[],
                searchObj:{
                    value:'',
                    name:"key",
                    operation:"LIKE",
                    type:"string"
                },
                groupTotal:0,
                showNullText:''
            }
        },
        watch:{
            searchKey:function () {
                this.getGroupList()
            }
        },
        methods:{
            getGroupList() { // 获取群列表
                let params={
                };
                this.$store.dispatch('get',{url:'',params}).then(res=>{
                    if (res) {
                        if (this.searchKey) {
                            this.groupList = res.result;
                            let regExp = new RegExp(this.searchObj.value, 'g');
                            this.groupList.map(val=>{
                                val.groupName =val.groupName.replace(regExp, "<span style='color:#f5a623'>" + this.searchObj.value + '</span>');
                            });
                            if (!this.groupList.length) {
                                this.showNullText = '未找到“<span style="color:#f5a623">'+this.searchKey+'</span>”关键字的结果'
                            }
                        } else {
                            this.groupList = res.result;
                            if (!this.groupList.length) {
                                this.showNullText = '<img src='+this.icon.nothing+' style="margin-top:6em;" alt=""><div class="nullText">暂无数据~</div>'
                            }

                        }

                        this.groupTotal = res.totalRecord;
                    }
                });
            },
            handleClick(row) {
                row.targetType = 0;
                this.$router.push({
                    name: 'chat',
                    query:row
                })
            }
        },
        mounted() {
          this.getGroupList()
        }
    }
</script>

<style lang="less">
  .groupList {
    height: 100%;
    overflow: auto;
    .weui-cells {
      margin-top: 0;
      &:before,&:after {
        height: 0;
        border-bottom: 0;
        border-top: 0;
      }
      .weui-cell {
        &:before {
          right: 15px;
          border-color: @default-grey-color;
        }
      }

    }
    .vux-label {
      float: left;
      .avatar {
        width: 2.7em;
        float: left;
        margin-right: 12px;
        border-radius: 2px;
      }
      .allTitle {
        display: inline-block;
        float: left;
        .title {
          display: block;
          font-size: 1em;
          color: @nick-name-color;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          width: 12em;
          height: 1.4em;
        }
        .subTitle {
          display: block;
          font-size: .8em;
          color: @subNick-name-color;
        }
      }
    }
    .totalTip {
      margin-top: 8px;
      font-size: .8em;
      text-align: center;
      color: @group-total-color;
      margin-bottom: 10px;
    }
    .nullText {
      margin: 10px 0 ;
      font-size: .8125em;
      color: #6C7293;
    }
  }
</style>
