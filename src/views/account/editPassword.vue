<template>
	<div>
		<el-dialog
			title="修改密码"
			:visible.sync="dialogFormVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			class="public-dialog"
			@close="closeDia"
			>
			<div>
				<el-form ref="editForm" :model="editForm" label-width="100px" :rules="editRules">
					<el-row :gutter="20">
						<el-col :span="20">
							<el-form-item label="密码" prop="password">
								<el-input class="input" v-model="editForm.password" show-password placeholder="请输入原密码"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="20">
							<el-form-item label="新密码" prop="passwordNew">
								<el-input class="input" v-model="editForm.passwordNew" show-password  placeholder="请输入新密码"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="20">
							<el-form-item label="再次输入新密码" prop="passwordPard">
								<el-input class="input" v-model="editForm.passwordPard" show-password placeholder="请再次输入新密码"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>

			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDia">取 消</el-button>
				<el-button type="primary" @click="handleFormSubmit" :disabled="disabeld">确 定</el-button>
			</div>

		</el-dialog>
	</div>
</template>

<script>
import * as api_common from "@/api/common";
import JsEncrypt from 'jsencrypt'
import auth from '@/utils/auth'
import qs from 'qs'
const publicString = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAlJM2wv1EAp9gid8qQpJrFVji/+yrIwpnqCv4MxkB2FHf8RQVoa27SdxqLSttMhcy0I33GCDIyx8VvBIKKJi7nDVKPjB+0MF7dDEQTn+eI/xGH2jqVybRhuXsLZx3C/RDRf+Rq/WPlMnvz2rzIR2qT8oaH/B29nf9/xldDTtYDwIDAQAB-----END PUBLIC KEY-----"
const jsen = JsEncrypt
let jse = new jsen()
jse.setPublicKey(publicString)

export default {
	props:['showModal'],
	data() {
		var validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入新密码'));
			} else {
				callback();
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.editForm.passwordNew) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};
		return {
			editForm: {
				password: '',
				passwordNew: '',
				passwordPard: '',
			},
			dialogFormVisible:false,
			editRules: {
				password: [
					{ required: true, trigger: "blur", message:'请输入原密码' }
				],
				passwordNew: [
					{ required: true, trigger: "blur", validator: validatePass, }
				],
				passwordPard: [
					{ required: true, trigger: "blur", validator: validatePass2, }
				]
			}
		};
	},
	watch: {
		showModal(val) {
			this.dialogFormVisible = val
		}
	},
	computed:{
		
		disabeld(){
            if(this.editForm.password==''||this.editForm.passwordNew==''||this.editForm.passwordPard==''||(this.editForm.passwordNew!=this.editForm.passwordPard)){
                return true
            }else{
                return false
            }
        }
	},
	methods:{
		closeDia() {
			this.$emit('close')
		},
		init() {
			this.editForm.passwordNew = '',
			this.editForm.password = '',
			this.editForm.passwordPard = ''
		},
		handleFormSubmit(){
			this.$request.post('/doc/pwd/',{
				old_password: jse.encrypt(this.editForm.password),
				pwd: jse.encrypt(this.editForm.passwordNew),
				pwd2: jse.encrypt(this.editForm.passwordPard)
			}).then((data) => {
				this.init()
				this.$emit('close')
				const newLog = qs.parse(auth.getLogInfo()) 
				newLog.change_pwd = 1
				auth.setLogInfo(newLog)
			})
		}
	},
	created(){
		// console.log(this.showModal,'visible')
	},
	mounted() {
		this.dialogFormVisible = this.showModal
		this.init()
	},
	destroyed() {
		this.$emit('close')
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	/deep/ .el-dialog {
		width: 30% !important;
	}
	/deep/ .el-form-item__label {
		width: 140px !important;
	}
	/deep/ .el-form-item__content {
		margin-left: 150px !important;
	}
</style>

