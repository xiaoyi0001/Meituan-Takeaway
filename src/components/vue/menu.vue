<template>
    <div class="m-menu">
        <!--左侧菜单栏-->
        <div class="menu-wrap" ref="menuWrapper">
            <ul class="menu-list">
                <li v-for="(item,index) in dishCategory" class="menu-item" :class="{'current':currentIndex === index}"
                    @click="selectMenu(index,$event)">{{ item.category }}
                </li>
            </ul>
        </div>
        <!--右侧食品栏-->
        <div class="foods-wrap" ref="foodsWrapper">
            <ul>
                <!--每个分类下的食品列表-->
                <li v-for="item in dishCategory" class="foods-list" ref="dishList">
                    <h1 class="title">{{ item.category }}</h1>
                    <ul>
                        <!--单个食品-->
                        <li v-for="food in item.dishList" class="food-item">
                            <div class="dish-basic">
                                <div class="img">
                                    <img :src="food.largeImg">
                                </div>
                                <div class="content">
                                    <div class="name">{{ food.name}}</div>
                                    <p class="description">{{ food.desc}}</p>
                                    <div class="extra">
                                        <span class="count">月售{{food.sold}}份</span>
                                    </div>
                                    <div class="deal">
                                        <span class="price">￥{{food.discountPrice}}</span>
                                        <div class="cart-wrapper">
                                            <cartControl :food="food"></cartControl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <cart :shop='shop' :selectFoods="selectFoods"></cart>
    </div>
</template>
<script>


    import '../../lib/flexible';
    import header from './header.vue';
    import axios from 'axios';
    import cart from './cart.vue';
    import cartcontrol from './cartcontrol.vue';
    import BScroll from 'better-scroll';

    export default{
        data() {
            return {
                shop: {},
                goods: [],
                dishCategory: [],
                listHeight: [],
                scrollY: 0
            }
        },
        computed: {
            currentIndex() {
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i + 1];
                    //使用scrollY判断当前是否滚动到第i和第i+1列列表之间,
                    // 如果是返回i,得到右侧列表索引i,否则返回0
                    //然后在左侧li标签中添加:class="{'current':currentIndex === index}
                    //当currentIndex和左侧索引值相等时li才有current类名
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        return i;
                    }
                }
                return 0;
            },
            selectFoods(){
                let self = this,
                        foods = [];
                //dishCategory为商品种类
                let dishList = self.dishCategory;
                dishList.forEach((item)=> {
                    //dishList为商品信息列表
                    var foodItem = item.dishList;
                    foodItem.forEach((food)=> {
                        if (food.count) {
                            //food为单个商品信息,将下单的商品信息(包含商品数量属性count)放到foods数组中
                            foods.push(food);
                        }
                    })
                });
                return foods;
            }
        },
        created(){
            var self = this;
            axios.get('static/goodsData.json').then((res)=> {
                let shopData = res.data.data;
                self.shop = shopData.shopInfo;
                self.dishCategory = shopData.dishCategory;
                //点击事件放在$nextTick里,会等到页面加载完成才会执行.
                self.$nextTick(() => {
                    self._initScroll();
                    self._calculateHeight();
                });
            })
        },
        methods: {
            selectMenu(index,event){
                if(!event._constructed){
                    return false;
                }
                let dishList = this.$refs.dishList;
                let $el = dishList[index];
                this.foodsScroll.scrollToElement($el, 300);
            },
            _initScroll() {
                this.meunScroll = new BScroll(this.$refs.menuWrapper, {
                    //启用点击事件,click为true
                    click: true
                });

                this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                    click: true,
                    //probeType值为3实时探测滚动的位置
                    probeType: 3
                });

                this.foodsScroll.on('scroll', (pos) => {
                    //将当前滚动到的位置scrollY取整
                    this.scrollY = Math.abs(Math.round(pos.y));
                });
            },
            _calculateHeight() {
                let foodList = this.$refs.dishList;
                let height = 0;
                this.listHeight.push(height);
                for (let i = 0; i < foodList.length; i++) {
                    let item = foodList[i];
                    //使用clientHeight计算右侧每列的高
                    console.log('当前高度:'+item.clientHeight);
                    height += item.clientHeight;
                    //将右侧每列的高存到数组listHeight
                    this.listHeight.push(height);
                    console.log(this.listHeight[this.listHeight.length - 1]);

                }
            }
        },
        components: {
            'cart': cart,
            'cartControl': cartcontrol
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    @import '../less/common.less';
    @import "../less/menu.less";
</style>
