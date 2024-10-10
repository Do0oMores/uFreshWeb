<template>
	<div class="container">
		<div class="register-wrapper">
			<div class="header">注册您的新账号</div>
			<div class="form-wrapper">
				<form @submit.prevent="fetchData">
					<input type="text" v-model="username" name="username" placeholder="用户名" class="input-item">
					<input type="password" v-model="password_1" name="password_1" placeholder="密码" class="input-item">
					<input type="password" v-model="password_2" placeholder="重复密码" class="input-item">
					<input type="text" v-model="phone" name="phone" placeholder="电话号码" class="input-item">
					<button class="btn" type="submit">注册</button>
				</form>
			</div>
			<div class="msg">
				<a @click="gotoLogin()">点此返回登录</a>
			</div>
		</div>
		<div class="extra-content">
			<p>欢迎来到我们的网站！</p>
			<p>这里有更多的内容等待您探索。</p>
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
		const username = ref('');
		const password_1 = ref('');
		const password_2 = ref('');
		const phone = ref('');
		const router = useRouter();

		const gotoLogin = () => {
			router.push('/login');
		};

		const fetchData = () => {
			// 去除所有空格
			username.value = username.value.replace(/[\t\r\f\n\s]*/g, '');
			password_1.value = password_1.value.replace(/[\t\r\f\n\s]*/g, '');
			password_2.value = password_2.value.replace(/[\t\r\f\n\s]*/g, '');

			// 判断是否为空
			if (username.value && password_1.value && password_2.value) {
				if (password_1.value === password_2.value) {
					axios
						.get(`/api/register`, {
							params: {
								username: username.value,//用户名
								userpassword: password_1.value,//密码
								phone: phone.value//电话号码
							}
						}
						)
						.then((response) => {
							console.log(response.data);
							//处理后端响应
							if (response.data.code === 200) {
								ElMessage.success(response.data.msg);
								setTimeout(() => {
									router.push('/login');
								}, 1000);
							} else {
								ElMessage.error(response.data.msg);
							}
						})
						.catch((error) => {
							console.log(error);
						});
				} else {
					ElMessage.error('两次输入的密码不一致，请确认后重新输入');
				}
			} else {
				ElMessage.error('用户名与密码都不能为空');
			}
		};

		return {
			username,
			password_1,
			password_2,
			phone,
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

.container {
	background: url("../pic/register.png") no-repeat center center fixed;
	background-size: cover;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-bottom: 20px;
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