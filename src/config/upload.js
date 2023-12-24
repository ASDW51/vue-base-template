
export let uploadMode = "default"
export const uploadModeType = {
	"default":{
		tag:"default://",
		target:process.env.VUE_APP_STATIC_URL,
		upload:()=>{}
	}
}