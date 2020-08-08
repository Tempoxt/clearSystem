<template>
    <el-dialog
    title="调整图像"
    :visible.sync="dialogVisible"
    width="60%"
    append-to-body
    class="public-dialog"
    v-el-drag-dialog
    >
   
    <div style="position: relative;">
        <!-- url -->
        <img id="cropimage" :src="url" ref="image" :style="`height:${imgHeight}px`">
        <div class="button-actions">
            <el-button-group>
            <el-button type="primary" icon="el-icon-refresh-left" @click="rotate(-45)"></el-button>
            <el-button type="primary" icon="el-icon-refresh-right" @click="rotate(45)"></el-button>
            </el-button-group>
        </div>
    </div>


    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getImageData">确 定</el-button>
    </span>
    </el-dialog>
</template>
<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css';
export default {
    props:['visible','url'],
    computed:{
        dialogVisible:{
            get(){
                return this.visible
            },
            set(val){
                
                this.$emit('update:visible',val)
            }
        }
    },
    watch:{
        visible(val){
            if(!val){
                this.cropper && this.cropper.destroy()
            }else{
                this.initCrop()
            }
        }
    },
    data(){
        return {
           imgHeight:window.document.body.clientHeight/2
        }
    },
    methods:{
        getImageData(){
            // const imageData = this.cropper.getCroppedCanvas().toDataURL('image/jpeg');
            this.cropper.getCroppedCanvas().toBlob((blob)=>{
                this.$emit('onBlob',blob)
                this.dialogVisible = false
            })
          
        },
        rotate(rotate){
            this.cropper.rotate(rotate)
        },
        initCrop(){
            this.$nextTick(()=>{
                const image = document.getElementById('cropimage');
                        this.cropper = new Cropper(this.$refs.image, {
                        aspectRatio: 16 / 9,
                        minCropBoxWidth:500,
                        crop(event) {
                           
                        },
                    });
                }
            )}
    },
    mounted(){
        this.initCrop()
    }
}
</script>

<style>
#cropimage {
    max-width: 100%;
}
.button-actions {
    position: absolute;
    right: 10px;
    bottom: 10px;
}
</style>
