<template>
  <div class="welcom">
    <div class="text">欢迎登陆电商管理系统</div>
  </div>
</template>

<script>
export default {
  name: 'Welcom'
}
</script>

<style lang="less" scope>
.welcom {
  width: 100%;
  height: 100%;
  position: relative;
  .text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 50px;
  }
}
</style>