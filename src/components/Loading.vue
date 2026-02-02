
<template>
    <div class="loading-box">
        <div>
            <div class="style-a" v-if="loading_model == 'style-a' || loading_model == ''">
                <div></div>
                <div></div>
            </div>
            <div class="style-b" v-else-if="loading_model == 'style-b'">
                <div>Create your loading here</div>
                <div></div>
            </div>
        </div>
    </div>
</template>


<script>
export default{
  props: ['loading_model'],
}
</script>

<style>
.loading-box{
    margin-right: 12px !important;
}

.style-a {
    opacity: 0.5;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    position: relative;
    display: inline-block;
}

.style-a div {
    border: 6px solid #1f60a8;
    position: absolute;
    width: 24px;
    height: 24px;
    opacity: 2;
    border-radius: 50%;
    animation: style-a 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.style-a div:nth-child(2){
  background: #1f60a8 !important;
}

@keyframes style-a {
  0% {
    border: 6px solid #eb5757;
    background: #eb5757 !important;
    opacity: 1;
  }
  4.9% {
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

</style>
