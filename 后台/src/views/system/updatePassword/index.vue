<template>
	<div class="page-login">
		<div class="page-login--layer">
			<div class="page-login--content" flex="dir:top main:justify cross:stretch box:justify">
				<div class="page-login--content-header">
				</div>
				<div class="page-login--content-main" flex="dir:top main:center cross:center">
					<div class="page-login--form" style="width: 400px;">
						<el-card shadow="never">
							<el-form ref="loginForm" label-position="top" :model="passwordForm" size="default">
								<el-form-item prop="username">
									<el-input type="password" v-model="passwordForm.oldPassword" placeholder="旧密码">
										<i slot="prepend">旧密码</i>
									</el-input>
								</el-form-item>
								<el-form-item prop="username">
									<el-input type="password" v-model="passwordForm.newPassword" placeholder="新密码">
										<i slot="prepend">新密码</i>
									</el-input>
								</el-form-item>
							</el-form>
							<el-button style="width: 48%;" @click="backindex">取 消</el-button>
							<el-button style="width: 48%;" type="primary" @click="sumbit">确 认</el-button>
						</el-card>
					</div>
				</div>
				<div class="page-login--content-footer">
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapActions } from 'vuex'
	import { exMessage, changeEx, getNewKey, exLongMessage } from '@/libs/exJSE.js'
	import { ChangePassword, AboutKey, getPermitList, getUserInfoS, getPathList, getCap } from '@/api/Login.js'
	import util from '@/libs/util.js'
	import store from '@/store/index'


	export default {
		name: 'update-password',
		data() {
			return {
				timeInterval: null,
				// 新密码的表单
				passwordForm: {
					newPassword: '',
					oldPassword: ''
				}
			};
		},
		mounted() {
			// getNewKey();
		},
		beforeDestroy() {
			clearInterval(this.timeInterval)
		},
		methods: {
			backindex() {
				this.$router.go(-1); //返回上一层
			},

			sumbit() {
				/*var date = new Date();
				if(util.cookies.get('expire') > date.getTime()){
					console.log("未过期");
					this.changePassword()
				}else{
					getNewKey();
					setTimeout(function () {
						this.changePassword()
					},1000)
				}*/
				this.changePassword();
			},

			changePassword() {
				if (this.passwordForm.oldPassword == "") {
					this.$message({
						type: 'error',
						message: '请输入旧密码'
					})
				} else if (this.passwordForm.newPassword == "") {
					this.$message({
						type: 'error',
						message: '请输入新密码'
					})
				} else {
					ChangePassword(this.passwordForm).then(res => {
						console.log(res);
						if (res.code == 0) {
							this.$router.go(-1); //返回上一层
							this.$message({
								type: 'success',
								message: '密码修改成功'
							})
						} else if (res.code == 503) {
							this.$message({
								type: 'error',
								message: res.msg,
							});
						} else {
							this.$message({
								type: 'error',
								message: res.msg
							})
						}
					})
				}
			},

		}
	};

</script>
