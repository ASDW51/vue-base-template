import bus from "./bus"

function success(msg){
	bus.$message.success(msg)
}
function warning(msg){
	bus.$message.warning(msg)
}
function info(msg){
	bus.$message.info(msg)
}
function error(msg){
	bus.$message.error(msg)
}

export {
	success,
	warning,
	info,
	error
}
export default {
	success,
	warning,
	info,
	error
}