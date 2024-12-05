<template>
	<div class="container">
		<div class="login-wrapper">
			<div class="gif-wrapper">
				<img src="../pic/login.gif" alt="Login Animation" class="login-gif" />
			</div>
			<div class="header">登录</div>
			<div class="form-wrapper">
				<form @submit.prevent="fetchData">
					<input v-model="userName" type="text" name="userName" id="userName" placeholder="账号"
						class="input-item">
					<input v-model="userPassword" type="password" name="userPassword" id="userPassword" placeholder="密码"
						class="input-item">
					<button class="loginButton" id="loginButton" type="submit">登录</button>
				</form>
			</div>
			<div class="msg">
				<a @click="gotoRegister">没有账号？ 点此注册</a>
			</div>
		</div>
		<div class="extra-content">
			<p>欢迎来到我们的网站！</p>
			<p>这里有更多的内容等待您探索。</p>
		</div>
	</div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import GlobalVar from "../stores/global";

export default {
	setup() {

		const router = useRouter();
		const route = useRoute();
		const userName = ref('');
		const userPassword = ref('');

		const gotoRegister = () => {
			router.push('/register');
		};

		onMounted(() => {

			if (!sessionStorage.getItem('hasRefreshed')) {
				sessionStorage.setItem('hasRefreshed', 'true');
				window.location.reload();
			} else {
				if (route.query.message) {
					ElMessage.error(route.query.message as string);
				}
				sessionStorage.removeItem('hasRefreshed');
			}
			if (route.query.message) {
				ElMessage.error(route.query.message as string);
			}
		});

		const fetchData = async () => {
			if (userName.value && userPassword.value) {
				try {
					const response = await axios.post('/api/login', {
						user_name: userName.value,
						password: userPassword.value
					});
					const data = response.data;
					if (data.code === 200) {
						ElMessage.success(data.msg);
						sessionStorage.setItem('isLoggedIn', 'true');
						sessionStorage.setItem('userID', data.userID);
						GlobalVar.username = userName.value;  // 存储到全局变量
						setTimeout(() => {
							// 根据角色跳转不同页面
							if (data.role === "admin") {
								router.push('/admin');
							} else {
								router.push('/user');
							}
						}, 1000);
					} else {
						ElMessage.error(data.msg);
					}
				} catch (error) {
					console.error(error);
					ElMessage.error("请求失败，请稍后重试！");
				}
			} else {
				ElMessage.error("账号或者密码不能为空！");
			}
		};

		return {
			userName,
			userPassword,
			fetchData,
			gotoRegister
		};
	}
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
	background: url("../pic/login.jpg") no-repeat center center fixed;
	background-size: cover;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-bottom: 20px;
	text-align: center;
}

.extra-content {
	margin-top: 280px;
	color: white;
	font-size: 18px;
}

.login-wrapper {
	margin-top: 3%;
	background-color: rgba(255, 255, 255, 0.8);
	box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
	width: 380px;
	padding: 40px 50px;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	backdrop-filter: blur(8px);
	transition: all 0.8s ease;
}

.login-wrapper:hover {
	box-shadow: 0 5px 30px rgba(0, 0, 0, 0.4);
	transform: translateY(-5px);
}

.header {
	font-size: 36px;
	font-weight: 700;
	margin-bottom: 30px;
	color: #2c3e50;
}

.input-item {
	display: block;
	width: 100%;
	padding: 12px;
	margin-bottom: 18px;
	border: 1px solid #ccc;
	border-radius: 8px;
	font-size: 16px;
	outline: none;
	transition: border-color 0.3s ease;
}

.input-item:focus {
	border-color: #3498db;
	box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
}

.input-item::placeholder {
	color: #7f8c8d;
}

.loginButton {
	width: 100%;
	padding: 12px;
	margin-top: 20px;
	background-image: linear-gradient(to right, #a6c1ee, #fbc2eb);
	color: #fff;
	font-size: 16px;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	transition: background-image 0.8s ease, transform 0.8s ease;
}

.loginButton:hover {
	background-image: linear-gradient(to left, #a6c1ee, #fbc2eb);
	transform: translateY(-3px);
}

.msg {
	margin-top: 15px;
}

a {
	text-decoration: none;
	color: #3498db;
	font-weight: 600;
}

a:hover {
	text-decoration: underline;
}

.gif-wrapper {
	text-align: center;
	margin-bottom: 20px;
}

.login-gif {
	width: 100%;
	height: auto;
	max-width: 300px;
	display: block;
	margin: 0 auto;
	transition: opacity 0.8s ease-in-out;
}
</style>