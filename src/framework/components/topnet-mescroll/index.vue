<template>
  <mescroll-uni
    :ref="'mescrollRef' + o"
    @init="mescrollInit"
    height="100%"
    :top="top"
    :down="downOption"
    @down="downCallback"
    :up="upOption"
    @up="upCallback"
    @emptyclick="emptyClick"
    @scroll="scroll"
  >
    <!-- 数据列表 -->
    <slot :list="list"></slot>
  </mescroll-uni>
</template>

<script>
import MescrollMixin from "../../uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import MescrollMoreItemMixin from "../../uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js";
import MescrollUni from "../../uni_modules/mescroll-uni/components/mescroll-uni/mescroll-uni.vue";

export default {
  name: "TopnetMescroll",
  mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
  components: {
    MescrollUni,
  },
  data() {
    return {
      downOption: {
        auto: false, // 不自动加载 (mixin已处理第一个tab触发downCallback)
      },
      upOption: {
        auto: false, // 不自动加载
        onScroll: true,
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 10, // 每页数据的数量
        },
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          tip: "~ 空空如也 ~", // 提示
          btnText: "去看看",
        },
      },
      list: [], //列表数据
    };
  },
  props: {
    url: {
      type: String,
      default: "",
    },
    params: {
      type: Object,
      default: () => {},
    },
    o: {
      type: Number,
      default: 0,
    }, // 每个tab页的专属下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
    indey: {
      // 当前tab的下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
      type: Number,
      default() {
        return 0;
      },
    },
    top: {
      type: Number,
      default: 0,
    },
  },
  created() {
    if (this.o === this.indey) {
      this.isInit = true;
      this.$nextTick(() => {
        this.mescroll.resetUpScroll();
      });
    }
  },
  watch: {
    indey(value) {
      if (!this.isInit && this.o === value) {
        this.isInit = true;
        this.mescroll.resetUpScroll();
      }
    },
  },
  methods: {
    /*下拉刷新的回调 */
    downCallback() {
      // 这里加载你想下拉刷新的数据, 比如刷新轮播数据
      // loadSwiper();
      // 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
      this.mescroll.resetUpScroll();
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      //联网加载数据
      let param = {
        pageNo: page.num,
        pageSize: page.size,
      };
      let params = this.params ? Object.assign(param, this.params) : param;
      this.$http
        .request({
          url: this.url,
          data: params,
        })
        .then((result) => {
          let res = result;
          if (res.code === 0) {
            let curPageData = res.data.content;
            //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            this.mescroll.endSuccess(curPageData.length);
            //设置列表数据
            if (param.pageNo == 1) this.list = []; //如果是第一页需手动制空列表
            this.list = this.list.concat(curPageData); //追加新数据
          }
        })
        .catch(() => {
          //联网失败, 结束加载
          this.mescroll.endErr();
        });
    },
    //点击空布局按钮的回调
    emptyClick() {
      this.$emit("emptyClick");
    },
    scroll(meScroll) {
      this.$emit("scroll", meScroll);
    },
  },
};
</script>
