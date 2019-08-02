$('#userlist').click((e)=>{
    console.log(e.target.innerHTML)
    $.get(
        '/userdata',
        {
            name: e.target.innerHTML
        },
        (data)=>{
            console.log(data)
            let details=$('#details')
            $('#close').show()
            details.empty()
            details.show()
            details.append(`
                Name: ${data.name} <br>
                Date of Birth: ${data.dob} <br>
                Place of Birth: ${data.pob} <br>
                Gender: ${data.gender} <br>
                Father's Name: ${data.fathername} <br>
                Mother's Name: ${data.mothername} <br>
                Parmanent Address: ${data.paddress} <br>
                Temporary Address: ${data.taddress} <br>
                Nationality: ${data.nationality} <br>
                e-mail: ${data.email} <br>
                Phone: ${data.phone}
                <br><br>
                <button><a href="/edit?name=${data.name}">Edit</a></button>
                <button><a href="/delete?email=${data.email}">Delete Student</a></button>
            `)
        }
    )
})