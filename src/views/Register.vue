<template>
	<div class="container">
		<div class="register-wrapper">
			<div class="gif-wrapper">
				<img src="../pic/register.gif" alt="register Animation" class="register-gif" />
			</div>
			<div class="header">注册您的新账号</div>
			<div class="form-wrapper">
				<form @submit.prevent="fetchData">
					<input type="text" v-model="username" name="username" placeholder="用户名" class="input-item">
					<input type="password" v-model="password_1" name="password_1" placeholder="密码" class="input-item">
					<input type="password" v-model="password_2" placeholder="重复密码" class="input-item">
					<input type="text" v-model="email" name="email" placeholder="电子邮箱" class="input-item">

					<div class="captcha-wrapper">
						<input type="text" v-model="captcha" placeholder="请输入验证码" class="input-item captcha-input">
						<button type="button" class="btn-captcha" @click="sendCaptcha">发送验证码</button>
					</div>

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
		const email = ref('');
		const captcha = ref('');
		const sentCaptcha = ref('');
		const router = useRouter();

		const gotoLogin = () => {
			router.push('/login');
		};

		// 发送验证码请求
		const sendCaptcha = () => {
			console.log(email.value);
			if (email.value) {
				axios
					.post('/api/mail', { email: email.value })
					.then((response) => {
						const data = response.data;
						const statusCode = Object.keys(data)[0];
						const message = data[statusCode];

						if (response.data.code === 200) {
							ElMessage.success(response.data.message);
						} else {
							ElMessage.error(response.data.message);
						}
					})
					.catch((error) => {
						console.log(error);
						ElMessage.error('验证码发送失败，请重试');
					});
			} else {
				ElMessage.error('请输入有效的电子邮箱');
			}
		};

		// 注册
		const fetchData = () => {
			// 去除所有空格
			username.value = username.value.replace(/[\t\r\f\n\s]*/g, '');
			password_1.value = password_1.value.replace(/[\t\r\f\n\s]*/g, '');
			password_2.value = password_2.value.replace(/[\t\r\f\n\s]*/g, '');

			// 判断是否为空
			if (username.value && password_1.value && password_2.value) {
				if (password_1.value === password_2.value) {
					axios.post('/api/verify', {
						email: email.value,
						code: captcha.value
					}).then((response) => {
						const data = response.data;
						if (data.code === 200) {
							axios
								.post(`/api/register`, {
									user_name: username.value,//用户名
									password: password_1.value,//密码
									email: email.value//电子邮箱
								})
								.then((response) => {
									console.log(response.data);
									const data = response.data;

									//处理后端响应
									if (data.code === 200) {
										ElMessage.success(data.message);
										setTimeout(() => {
											router.push('/login');
										}, 1000);
									} else {
										ElMessage.error(data.message);
									}
								})
								.catch((error) => {
									console.log(error);
								});
						} else {
							ElMessage.error(data.message);
						}
					})

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
			email,
			captcha,
			sentCaptcha,
			gotoLogin,
			sendCaptcha,
			fetchData,
		};
	},
};
</script>

<style scoped>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

html,
body {
	height: 100%;
	margin: 0;
	padding: 0;
	font-family: 'Arial', sans-serif;
}

.container {
	background: url("../pic/register.jpg") no-repeat center center fixed;
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
	margin-top: 50px;
	text-align: center;
	color: white;
	font-size: 18px;
}

.register-wrapper {
	margin-top: 5%;
	background-color: rgba(255, 255, 255, 0.7);
	box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15);
	width: 380px;
	height: auto;
	border-radius: 15px;
	padding: 40px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	backdrop-filter: blur(5px);
	transition: all 1.5s ease;
}

.register-wrapper:hover {
	box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
	transform: translateY(-5px);
}

.header {
	font-size: 28px;
	font-weight: 700;
	text-align: center;
	line-height: 1.5;
	margin-bottom: 30px;
	color: #2c3e50;
}

.input-item {
	display: block;
	width: 100%;
	margin-top: 15px;
	margin-bottom: 15px;
	padding: 12px;
	border: 1px solid #ccc;
	border-radius: 5px;
	font-size: 16px;
	outline: none;
	transition: all 0.3s ease;
}

.input-item:focus {
	border-color: #3498db;
	box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
	transition: all 1.5s ease;
}

.input-item::placeholder {
	color: #7f8c8d;
}

.btn {
	padding: 12px;
	width: 100%;
	margin-top: 20px;
	background-image: linear-gradient(to right, #a6c1ee, #395e91);
	color: white;
	font-size: 16px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	transition: all 0.8s ease;
}

.btn:hover {
	background-image: linear-gradient(to left, #a6c1ee, #395e91);
	transform: translateY(-3px);
	transition: all 1.5s ease;
}

.msg {
	margin-top: 15px;
	text-align: center;
	line-height: 20px;
}

a {
	text-decoration: none;
	color: #3498db;
	font-weight: 600;
}

a:hover {
	text-decoration: underline;
}

.captcha-wrapper {
	display: flex;
	width: 100%;
	margin-bottom: 20px;
}

.captcha-input {
	flex: 2;
	/* 设置为输入框占用的比例 */
	border-radius: 5px;
	font-size: 14px;
	padding: 12px;
	margin-right: 10px;
	/* 保证输入框与按钮之间有间隙 */
}

.btn-captcha {
	flex: 1;
	/* 设置为按钮占用的比例 */
	background-color: #4CAF50;
	color: white;
	border: none;
	padding: 12px;
	cursor: pointer;
	border-radius: 5px;
	transition: background-color 0.8s ease;
	font-size: 15px;
}

.btn-captcha:hover {
	background-color: #45a049;
}

.gif-wrapper {
	text-align: center;
	margin-bottom: 20px;
}

.register-gif {
	width: 100%;
	height: auto;
	max-width: 300px;
	display: block;
	margin: 0 auto;
	transition: opacity 0.8s ease-in-out;
}
</style>