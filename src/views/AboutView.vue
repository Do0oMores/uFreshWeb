<template>
  <div class="videoContainer">
    <video class="video" id="bgVideo" playsinline="true" autoplay="true" muted="" loop="">
      <source src="../video/videoplayback.mp4" type="video/mp4">
    </video>
    <nav class="navbar">
      <ul>
        <li><img src="../pic/index.jpg"></li>
        <li>
          <h1>优鲜</h1>
        </li>
        <li><h2>优选生鲜，鲜美每一天</h2></li>
      </ul>
    </nav>
    <button class="loginButton" @click="redirectToLogin">开始探索</button>
  </div>
</template>

<style>
.videoContainer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
}

.videoContainer::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  z-index: -1;
  top: 0;
  left: 0;
  background: rgba(25, 29, 34, 0.65);
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(88, 88, 88, 0.5);
  color: white;
  padding: 10px 20px;
  z-index: 10;
  display: flex;
  justify-content: space-between;
}

.navbar ul {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  margin-left: 100px;
}

.navbar ul li {
  margin-right: 20px;
}

.navbar ul li a {
  color: white;
  text-decoration: none;
}

.navbar ul li img {
  border-radius: 30%;
}

.navbar ul li a:hover {
  text-decoration: underline;
}

.navbar ul li h2{
  text-align: center;
}

.loginButton {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px 50px;
  background-color: rgba(60, 60, 60, 0.7);
  color: rgb(240, 240, 240);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 20;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.loginButton:hover {
  background-color: rgba(50, 60, 60, 0.9);
}
</style>

<script>
export default {
  methods: {
    redirectToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>
