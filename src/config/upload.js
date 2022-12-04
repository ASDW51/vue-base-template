import { uploadBucket, uploadFile } from "@/apis/file"

export const uploadMode = "bucket"
export const uploadModeType = {
    "default":{
        tag:"default://",
        target:process.env.VUE_APP_REQUEST_URL,
        upload:uploadFile
    },
    "bucket":{
        tag:"bucket://",
        target:"https://iiweb-1305134676.cos.ap-guangzhou.myqcloud.com",
        upload:uploadBucket
    }
}