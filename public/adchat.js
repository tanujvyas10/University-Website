let socket=io()

$(()=>{
    const chatbtn=$('#chatbtn')
    const chatinput=$('#chatinput')
    const chatList=$('#chatList')
    const to=$('#to')
    const current_user=$('#user')[0].outerText

    $.get(
        '/getusers',
        (data)=>{
            let users
            let details=$('#details')
            for(let i=0;i<data.users.length;i++){
                // users[i]=data.users[i].username
                details.after(`<li class="u point">${data.users[i].username} </li>`)
            }
        }
    )
    .then(()=>{
        $('.u').click((e)=>{
            // alert(e.target.innerText)
            socket.emit('custommsg', {
                usernam: e.target.innerText
            })
        })
    })
    
    socket.on('customdata', (data)=>{
        chatList.empty()
        chatList.append(`<h3>${data.name} -</h3><br>`)
        if(data.messages.length == 0){
            chatList.append('No messages yet !!<br>')
        }
        for(let x=0;x<data.messages.length;x++){
            if(data.messages[x].from == data.name){
                chatList.append(`<li><b>${data.messages[x].from}:</b> ${data.messages[x].msg}</li>`)
            }
            else{
                chatList.append(`<li class="my">${data.messages[x].msg} <b>:${data.messages[x].from}</b></li>`)
            }
        }
        chatList.show()
    })

    chatbtn.click(()=>{
        socket.emit('sendChat', {
            To: to.val(),
            from: current_user,
            msg: chatinput.val()
        })
    })

    socket.on('chatSaved', (data)=>{
        chatList.append(`${data.from}: ${data.msg}`)
    })


})