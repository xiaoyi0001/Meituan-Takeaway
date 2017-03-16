<template>
    <!--没添加商品-->
    <div class="cartfooter" v-if="!totalCount">
        <div class="container">
            <i class="cart"></i>
            <p class="min-del">另需配送费￥{{ shop.deliveryFee }}</p>
            <p class="min-fee">{{ shop.minFee }}￥起送</p>
        </div>
    </div>
    <!--已添加商品-->
    <div class="new-cart" v-else>
        <div class="box">
            <i class="cart-icon" @click="toggleList">
                <i class="num">{{totalCount}}</i>
            </i>
            <div class="price-box">
                <p class="total"> ￥{{totalPrice}}</p>
                <p class="delivery">另需配送费￥{{shop.deliveryFee}}</p>
            </div>
            <div class="btn-submit" @click="goAccount">去结算</div>
        </div>
        <!--购物车盒子-->
        <transition name="flag">
            <div class="cart-panel-detail" v-show="cartShow">
                <div class="shopcart-container">
                    <div class="cart-head">
                        <span class="titile">购物车</span>
                        <span class="clear-icon"></span>
                        <span class="clear-btn" @click="clearCart">清空购物车</span>
                    </div>
                    <ul class="cart-content" ref="listContent">
                        <li class="dish-list" v-for="item in selectFoods">
                            <p class="name">{{item.name}}</p>
                            <p class="price">￥{{ item.discountPrice}}</p>
                            <cartControl :food="item"></cartControl>
                        </li>
                    </ul>
                </div>
                <div class="dialog" v-show="showDialog">
                    <div class="content">确定要清空购物车吗？</div>
                    <div class="btn">
                        <a href="#" class="cancel">取消</a>
                        <a href="#" class="confirm" id="confirm">确定</a>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<style lang="less" rel="stylesheet/less">
    @import "../less/common.less";
    @import "../less/shopcart.less";
</style>
<script>
    import '../../lib/flexible.js';
    import cartcontrol from './cartcontrol.vue'
    import BScroll from 'better-scroll';

    export default{
        props: {
            //指定selectFoods的类型为数组
            selectFoods: {
                type: Array
            },
            shop: {
                type: Object
            }
        },
        data(){
            return {
                dish: {},
                flag: true,
                showDialog: false
            }
        },
        computed: {
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((item) => {
                    this.dish = item;
                    //当商品有count和discountPrice属性时,计算总价格
                    if (item.count && item.discountPrice) {
                        total += item.discountPrice * item.count;
                        //解决转换成二进制而计算不准确的问题
                        total = parseInt(total * 100) / 100;
                    }
                });
                return total;
            },
            totalCount() {
                let count = 0;
                this.selectFoods.forEach((item) => {
                    if (item.count) {
                        count += item.count;
                    }
                });
                return count;
            },
            cartShow() {
                //vue对象不存在totalCount说明购物车里没有物品,点击购物车不显示
                if (!this.totalCount) {
                    this.flag = true;
                    return false;
                }
                let show = !this.flag;
                if (show) {
                    this.$nextTick(() => {
                        //显示购物车,并设置可以滚动
                        if (!this.scroll) {
                            this.scroll = new BScroll(this.$refs.listContent, {
                                click: true
                            });
                        } else {
                            this.scroll.refresh();
                        }
                    });
                }
                return show;
            }
        },
        methods: {
            goAccount(){
                window.alert(`支付${this.totalPrice + this.shop.deliveryFee}元`);
            },

            toggleList() {
                //当vue对象有属性totalCount说明购物车里有物品,可以点击弹出购物车清单,
                //否则不能点击
                if (!this.totalCount) {
                    return false;
                }
                //让购物车点击隐藏再点击显示切换
                this.flag = !this.flag;
            },
            hideList() {
                this.flag = true;
            },
            clearCart() {
                var self = this;
                self.showDialog = true;
                var confirmBtn = document.getElementById('confirm');
                var cancelBtn = document.getElementsByClassName('cancel')[0];
                if (self.showDialog) {
                    confirmBtn.addEventListener('click', function () {
                        self.selectFoods.forEach((item) => {
                            item.count = 0;
                            self.showDialog = false;//防止点击购物车icon直接出现对话框
                            self.flag = true;//防止清空购物车后再次点击加入购物车出现购物车弹出
                        });
                    });
                    cancelBtn.addEventListener('click', function () {
                        self.showDialog = false;
                    })
                }
            }
        },
        components: {
            cartControl: cartcontrol
        }
    }
</script>
