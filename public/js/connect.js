let ajaxPost = (path, sendData)=>{
    $.post(path,sendData,(result)=>{
        console.log(result);
    })
}