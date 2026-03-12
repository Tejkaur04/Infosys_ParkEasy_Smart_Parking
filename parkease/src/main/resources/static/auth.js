// async function signupUser(e){
// e.preventDefault();

// ```
// const data={
//     name:document.querySelector("input[type=text]").value,
//     email:document.querySelector("input[type=email]").value,
//     password:document.querySelector("input[type=password]").value
// };

// const res = await fetch("/api/auth/signup",{
//     method:"POST",
//     headers:{"Content-Type":"application/json"},
//     body:JSON.stringify(data)
// });

// const msg = await res.text();
// alert(msg);

// if(msg==="Signup successful")
//     window.location="login.html";
// ```

// }

// function loginUser(event) {
//     event.preventDefault();
//     alert("Login clicked");

//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     if(email && password){
//         window.location.href = "admin.html";
//     }
// }