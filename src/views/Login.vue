<template>
	<div class="container">
		<div class="login-wrapper">
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

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import GlobalVar from "../stores/global";

const router = useRouter();
const userName = ref('');
const route = useRoute();
const userPassword = ref('');

const gotoRegister = () => {
	router.push('/register');
};

//跳转失败提示信息
onMounted(() => {
	if (route.query.message) {
		ElMessage.error(route.query.message as string);
	}
});

const fetchData = async () => {
	//判断不为空
	if (userName.value && userPassword.value) {
		try {
			const response = await axios.post('/api/login', {
				user_name: userName.value,
				password: userPassword.value
			});
			const data = response.data;
			const statusCode = Object.keys(data)[0];
			const message = data[statusCode];
			if (statusCode === "200") {
				ElMessage.success(message);
				sessionStorage.setItem('isLoggedIn', 'true');
				sessionStorage.setItem('userID', data.userID);
				console.log(data.userID);
				setTimeout(() => {
					GlobalVar.username = userName.value;
					if (data.role === "admin") {
						router.push('/admin');
					} else {
						router.push('/user');
					}
				}, 1000);
			} else {
				ElMessage.error(message);
			}
		} catch (error) {
			console.error(error);
			ElMessage.error("请求失败，请稍后重试！");
		}
	} else {
		ElMessage.error("账号或者密码不能为空！");
	}
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
	background: url("../pic/login.jpg") no-repeat center center fixed;
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


.login-wrapper {
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
	font-size: 38px;
	font-weight: bold;
	text-align: center;
	margin-bottom: 20px;
}

.input-item {
	display: block;
	width: 100%;
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

.loginButton {
	text-align: center;
	padding: 10px;
	width: 100%;
	margin-top: 20px;
	background-image: linear-gradient(to right, #a6c1ee, #fbc2eb);
	color: #fff;
}

.loginButton:hover {
	background-image: linear-gradient(to left, #a6c1ee, #fbc2eb);
}

.msg {
	text-align: center;
	margin-top: 20px;
}

a {
	text-decoration: none;
	color: #8387cd;
}
</style>