let socket=io()

$(()=>{
    const chatbtn=$('#chatbtn')
    const chatinput=$('#chatinput')
    const chatList=$('#chatList')
    const current_user=$('#user')[0].outerText

    chatbtn.click(()=>{
        socket.emit('sendChat', {
            To: 'admin',
            from: current_user,
            msg: chatinput.val()
        })
    })

    socket.on('chatSaved', (data)=>{
        chatList.append(`<li>${data.from}: ${data.msg}</li>`)
    })
})