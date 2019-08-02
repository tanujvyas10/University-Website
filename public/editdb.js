

let params = (new URL(document.location)).searchParams;
let name = params.get("name");
console.log(name)



        $.get(
            '/userdata',
            {
                name: name
            },
            (data)=>{
                console.log(data)
                let details=$('#details')
                details.append(`
                    <h1>Current Details:</h1>
                    <b>Date of Birth: </b>${data.dob} <br>
                    <b>Place of Birth: </b>${data.pob} <br>
                    <b>Gender: </b>${data.gender} <br>
                    <b>Father's Name: </b>${data.fathername} <br>
                    <b>Mother's Name: </b>${data.mothername} <br>
                    <b>Parmanent Address: </b>${data.paddress} <br>
                    <b>Temporary Address: </b>${data.taddress} <br>
                    <b>Nationality: </b>${data.nationality} <br>
                    <b>e-mail: </b>${data.email} <br>
                    <b>Phone: </b>${data.phone}
                `)
                document.getElementById('dob').value=data.dob
                document.getElementById('pob').value=data.pob
                document.getElementById('fathername').value=data.fathername
                document.getElementById('mothername').value=data.mothername
                document.getElementById('paddress').value=data.paddress
                document.getElementById('taddress').value=data.taddress
                document.getElementById('nationality').value=data.nationality
                document.getElementById('email').value=data.email
                document.getElementById('phone').value=data.phone
                document.getElementById('iname').value=name
                // document.getElementById('fname').value=data.name
            }
        )