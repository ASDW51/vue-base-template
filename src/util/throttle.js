const throttle = (fn,wait,immediately=true)=>{
    let timer = null
    return (...data)=>{
        if(timer)return
        if(immediately){
            let callNow = !timer
            timer = setTimeout(()=>{
                timer = null
            },wait)
            if(callNow)fn(...data)
        }else{
            timer = setTimeout(()=>{
                fn(...data)
                timer = null
            },wait)
        }
    }
}
export default throttle