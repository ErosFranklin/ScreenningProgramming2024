document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector("#formLogin");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        
        if (email.value == "" || password.value == "") {
            alert("Preencha todos os campos!");
            return;
        } else if(
            validarEmail(email.value) === true &&
            validarPassword(password.value) === true
        ){
            const login = async (email, password) => {
                const url = ${url_base}/api/login; 
                const data = {
                    email: email,
                    password: password
                };
            
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Error:', errorData.error);
                        return errorData;
                    }
            
                    const responseData = await response.json();
                    console.log('Success:', responseData);
                    return responseData;
            
                } catch (error) {
                    console.error('Fetch error:', error);
                }
            };
        /*
        window.location.href = "";
        */
        }
});
    
function validarEmail(email) {
    var emailRegex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return emailRegex.test(email);
}
function validarPassword(password){
    var passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
    return passwordRegex.test(password);
}
})
