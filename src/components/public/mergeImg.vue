<template lang="">
  <div class="mergeWrap">
    <!-- <canvas  id="canvas" width="1000" height="400"></canvas> -->
  </div>
</template>

<script>
import url from "@/assets/sign.png";
export default {
  name: 'mergeImg',
  mounted() {
    this.createCanvas()
  },
  data() {
    return {
      
    }
  },
  methods: {
    createCanvas(width = 360, height = 252) {
      let canvas = document.createElement('canvas')
      canvas.setAttribute('id', 'canvas')
      canvas.width = width
      canvas.height = height
      this.draw(canvas)
    },
    draw(canvas, width = 360, height = 252, dep = '周钟捷') {
      let day = new Date()
      const nowDay = day.getFullYear() + '.' + day.getMonth() + '.' + day.getDay()
      console.log(nowDay)
      let ctx = canvas.getContext('2d');
      let img = new Image();
      let that = this
      img.onload = () => {
        ctx.drawImage(img,0,0,width,height);
        ctx.fillStyle = '#e7434d'
        ctx.lineWidth = 5
        ctx.font = "48px serif"
        ctx.textAlign = 'center'
        ctx.fillText(nowDay, 180, 142)
        ctx.font = "40px serif"
        ctx.fillText(dep, 180, 210)
        that.createImg(canvas)
      };
      img.src = url;
      // ctx.drawImage(img,100,100,360,252);
      // ctx.drawImage(img,0,0);
      // ctx.beginPath();
      // ctx.moveTo(30,96);
      // ctx.lineTo(70,66);
      // ctx.lineTo(103,76);
      // ctx.lineTo(170,15);
      // ctx.stroke();
    },
    createImg(canvas) {
      let that = this
      let img = document.createElement('img')
      img.src = canvas.toDataURL("image/png")

      img.onload = () => {
        // console.log(img.src)
        that.downloadImg(img.src)
      }
    },
    downloadImg(img) {
      let a = document.createElement("a");
      a.href = img;
      a.download = "sign.png";
      a.target = "_blank";
      a.click();
    }
  },
}
</script>

<style lang="scss" scoped>
  /* .mergeWrap {
    position: fixed;
    z-index: 9999999;
    width: 1000px;
    height: 500px;
    background: #fff;
  } */
  
</style>