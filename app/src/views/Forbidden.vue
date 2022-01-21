<template>
  <div class="forbidden">
    <div class="page-center">
      <div class="pic-403">
        <img :src="img_403" alt="">
      </div>
      <div class="bullshit">
        <h1>403</h1>
        <p>{{message}}</p>
        <a href="/" class="bullshit__return-home">返回首页</a>
      </div>
    </div>
  </div>
</template>

<script>
  import img_403 from '@/assets/images/404_images/lock.svg';
  export default {
    name: 'forbidden',
    data () {
      return {
        img_403,
      };
    },
    computed: {
      message () {
        return '抱歉，你无权访问该页面';
      }
    }
  };
</script>
<style scoped>
  h1{
    font-size: 40px;

  }
  p{
    font-size: 16px;
  }
  .page-center{
    position: absolute;
    top:  50%;
    left: 50%;
    transform: translate(-50%, -80%);
  }
  .pic-403{
    float: left;
  }
  .bullshit{
    margin-left: 300px;
  }
  .bullshit__return-home {
    display: block;
    float: left;
    width: 110px;
    height: 36px;
    background: #1482f0;
    border-radius: 100px;
    text-align: center;
    color: #ffffff;
    opacity: 0;
    font-size: 14px;
    line-height: 36px;
    cursor: pointer;
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-delay: 0.3s;
    animation-fill-mode: forwards;
    text-decoration: none;
  }
  @keyframes slideUp {
    0% {
      transform: translateY(60px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
