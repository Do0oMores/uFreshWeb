<template>
	<div class="container">
		<div class="register-wrapper">
			<div class="header">TEST</div>
			<div class="form-wrapper">
				<form @submit.prevent="fetchData">
					<input type="text" v-model="mail" name="mail" placeholder="邮箱" class="input-item">
					<input type="text" v-model="code" name="code" placeholder="激活码" class="input-item">
					<button class="btn" type="submit">测试</button>
				</form>
			</div>
			<div class="msg">
				<a @click="gotoLogin()">点此返回登录</a>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

export default {
	name: 'register',
	setup() {
		const mail = ref('');
		const code = ref('');
		const router = useRouter();

		const gotoLogin = () => {
			router.push('/login');
		};

		const fetchData = () => {
			// 去除所有空格
			mail.value = mail.value.replace(/[\t\r\f\n\s]*/g, '');
			code.value = code.value.replace(/[\t\r\f\n\s]*/g, '');

			axios.post('/api/test', {
				mail: mail.value,
				code: code.value
			}).then((response => {
				const data = response.data;
				const statusCode = Object.keys(data)[0];
				const message = data[statusCode];
				if (statusCode === "200") {
					ElMessage.success("发送成功");
					ElMessage.success("测试码：" + code);
				} else {
					ElMessage.error("发送失败");
				}
			}))
		};

		return {
			mail,
			code,
			gotoLogin,
			fetchData,
		};
	},
};
</script>

<style scoped>
* {
	margin: 0;
	padding: 0;
}

html,
body {
	height: 100%;
	margin: 0;
	padding: 0;
}

.extra-content {
	margin-top: 300px;
	text-align: center;
	color: white;
}

.register-wrapper {
	background-color: rgba(255, 255, 255, 0.4);
	box-shadow: 0 5px 15px rgba(20, 20, 20, 0.8);
	width: 358px;
	height: 588px;
	border-radius: 15px;
	padding: 0 50px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	backdrop-filter: blur(3px);
}

.header {
	font-size: 30px;
	font-weight: bold;
	text-align: center;
	line-height: 20px;
}

.input-item {
	display: block;
	width: 100%;
	margin-top: 20px;
	margin-bottom: 20px;
	border: 0;
	padding: 10px;
	border-bottom: 1px solid rgb(128, 125, 125);
	font-size: 15px;
	outline: none;
}

.input-item::placeholder {
	text-transform: uppercase;
}

.btn {
	text-align: center;
	padding: 10px;
	width: 105%;
	margin-top: 40px;
	background-image: linear-gradient(to right, #a6c1ee, rgb(57, 99, 145));
	color: #fff;
}

.btn:hover {
	background-image: linear-gradient(to left, #a6c1ee, rgb(57, 99, 145));
}

.msg {
	margin-top: 10px;
	text-align: center;
	line-height: 20px;
}

a {
	text-decoration: none;
	color: #3c5892;
}
</style>