const debounce = (fn,wait)=>{
    let timer = null
    return (...data)=>{
        if(timer)clearInterval(timer)
        timer = setInterval(()=>{
            fn(...data)
        },wait)
    }
}

export default debounce