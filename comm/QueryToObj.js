export default (query)=>{
	let [host, pamas] = query.split('?')
	let resObj = {}
	if(!pamas || pamas.length<=0){

	}else{
		pamas = pamas.split('&')
		if(pamas && pamas.length>0){
			pamas.forEach(u => {
				let [key,value] = u.split('=')
				resObj[`${key}`]=value
			})
		}
	}
	return resObj;
}