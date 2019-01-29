export default {
	data: {
		showyusell: false,
		yusell:{
			title:'',
			content:''
		}
	},
	methods: {
		onCloseYuSell(){
			this.setData({
				showyusell:false
			})
		},
		openYuSell() {
			this.setData({
				showyusell: true
			})
		}
	}
}