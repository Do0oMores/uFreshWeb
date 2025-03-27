<template>
    <div class="after-sale-service">
        <h2 class="title">申请售后服务</h2>
        <el-form label-width="120px" class="after-sale-form">
            <el-form-item label="申请售后订单：">
                <p>{{ orderUid }}</p>
            </el-form-item>
            <el-form-item label="选择售后类型：">
                <el-select v-model="afterSaleType" placeholder="请选择">
                    <el-option label="退货" value="退货"></el-option>
                    <el-option label="换货" value="换货"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="填写售后原因：">
                <el-input v-model="reason" type="textarea" placeholder="请填写具体原因"></el-input>
            </el-form-item>
            <el-form-item label="上传佐证图片：">
                <el-upload class="upload-demo" :action="''" list-type="picture-card" :on-preview="handlePreview"
                    :on-remove="handleRemove" :on-change="handleImageChange" :auto-upload="false" multiple
                    :file-list="fileList">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
        </el-form>

        <div class="product-list">
            <h3 class="product-list-title">申请售后的商品</h3>
            <div class="product-item" v-for="(product, index) in products" :key="index">
                <div class="product-img">
                    <img :src="'http://localhost:8081' + product.image" alt="商品图片" />
                </div>
                <div class="product-info">
                    <p class="product-name">{{ product.commodity_name }}</p>
                    <p class="product-spec">{{ product.spec }}</p>
                </div>
                <div class="product-price">
                    <p>￥{{ product.price }}</p>
                    <p>x{{ product.quantity }}</p>
                    <p class="total-price">￥{{ product.price * product.quantity }}</p>
                </div>
            </div>
        </div>

        <el-button type="primary" class="submit-btn" @click="submitAfterSale">提交申请</el-button>
    </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
    data() {
        return {
            orderNumber: "",
            afterSaleType: "",
            reason: "",
            products: [],
            orderUid: null,
            fileList: ""
        };
    },
    created() {
        this.orderUid = this.$route.params.orderId;
        this.fetchAfterSales();
    },
    methods: {
        handlePreview(file) {
            console.log("预览文件", file);
        },
        handleRemove(file) {
            console.log("移除文件", file);
        },
        handleImageChange(file, fileList) {
            this.fileList = fileList;
        },
        async fetchAfterSales() {
            try {
                const response = await axios.post("/api/fetch-afterSalesItems", {
                    order_uuid: this.orderUid
                });
                if (response.data.code === 200) {
                    this.products = response.data.data;
                    console.log(this.products);
                } else {
                    ElMessage.error(response.data.message);
                }
            } catch (error) {
                console.log(error);
                ElMessage.error("请稍后重试");
            }
        },
        async submitAfterSale() {
            for (const file of this.fileList) {
                if (!file.uploaded) {
                    const formData = new FormData();
                    formData.append('file', file.raw);
                    formData.append('order_uuid', this.orderUid);
                    formData.append("reason", this.reason);
                    formData.append("type", this.afterSaleType);

                    try {
                        const response = await axios.post('/api/uploadAfterSales', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                        if (response.data.code === 200) {
                            file.uploaded = true; // 标记为已上传
                            ElMessage.success(response.data.message);
                        } else {
                            ElMessage.error(response.data.message);
                        }
                    } catch (error) {
                        console.log(error);
                        ElMessage.error('上传失败');
                    }
                }
            }
        }
    }
};
</script>

<style scoped>
.after-sale-service {
    width: 650px;
    margin: 20px auto;
    padding: 25px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.title {
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 25px;
    color: #333;
}

.after-sale-form {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
}

.product-list {
    margin-top: 20px;
}

.product-list-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
}

.product-item {
    display: flex;
    align-items: center;
    border: 1px solid #e0e0e0;
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 8px;
    background: #fff;
    transition: all 0.3s ease-in-out;
}

.product-item:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
}

.product-img img {
    width: 85px;
    height: 85px;
    border-radius: 5px;
    margin-right: 12px;
}

.product-info {
    flex-grow: 1;
}

.product-name {
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.product-spec {
    font-size: 14px;
    color: #777;
}

.product-price {
    text-align: right;
}

.total-price {
    color: red;
    font-weight: bold;
    font-size: 16px;
}

.submit-btn {
    width: 100%;
    margin-top: 20px;
    font-size: 16px;
    font-weight: bold;
}
</style>