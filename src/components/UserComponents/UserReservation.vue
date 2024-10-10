<template>
    <el-main>
        <div class="shoppingcart">
            <div class="aproduct" v-for="reservation in reservations" :key="reservation.productName">
                <p>{{ reservation.productName }}</p>
                <p class="price">单价：${{ reservation.price }}</p>
                <p class="total-price">预约数量：{{ reservation.amount }}</p>
                <p class="status">状态：{{ reservation.status }}</p>
            </div>
        </div>
    </el-main>
</template>
<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
    data() {
        return {
            reservations: [],
            userId: null
        };
    },
    created() {
        this.userId = this.getUserId();
        if (this.userId) {
            this.fetchData();
        } else {
            ElMessage.error('请先登录');
        }
    },
    methods: {
        getUserId() {
            return sessionStorage.getItem('userID') || null;
        },
        async fetchData() {
            try {
                const response = await axios.get('/api/get-user-reservation', {
                    params: {
                        userID: this.userId
                    }
                });
                if(response.data.code===200){
                    this.reservations=response.data.Data
                }else{
                    ElMessage.error(response.data.msg);
                }
            } catch (error) {
                ElMessage.error("服务器错误，请稍后再试")
            }
        }
    }
}


</script>

<style>
.shoppingcart {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.aproduct {
    display: flex;
    align-items: center;
    background-color: #12a8c9;
    border: 1px solid #2d502d;
    border-radius: 8px;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.aproduct p {
    margin: 10px 0;
}

.aproduct p:first-of-type {
    font-weight: bold;
    /* 商品名称加粗 */
}

.aproduct:hover {
    transform: translateY(-5px);
    /* 鼠标悬停时上移 */
}
</style>