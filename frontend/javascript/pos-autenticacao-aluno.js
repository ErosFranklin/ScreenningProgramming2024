document.addEventListener('DOMContentLoaded', function(){
    const name = localStorage.getItem('nome');
    const dataNasc = localStorage.getItem('dataNasc');
    console.log(dataNasc)

    if (name) {
        const nameField = document.querySelector('#nome');
        nameField.value = name;
    }
    if (dataNasc) {
       const dataNascConverted = convertDateFormat(dataNasc); 
       const dataNascField = document.querySelector('#nascimento');
       dataNascField.value = dataNascConverted;
   }
   document.querySelector('#formPosAutentProfessor').addEventListener('submit', async function(event){
       event.preventDefault();

       const gender = document.getElementById('genero').value;
       const period = document.getElementById('periodo').value;
       const registration = document.getElementById('matricula').value;
       const password = document.getElementById('password').value;
       const city = document.getElementById('cidade').value;
       const state = document.getElementById('estado').value;
       const institution = document.getElementById('instituicao').value;
       const passwordNew = dicument.getElementById('passwordPA').value;

       if(name === "" || gender ==="" || period==="" || registration === "" || password === "" || city === "" ||
        state === "" || institution ==="" || passwordNew === ""){
           alert("Preencha todos os campos!!!");
           return
       }
       if (!validarPassword(passwordNew)) {
           alert("A senha deve conter entre 6 e 20 caracteres, pelo menos um número e uma letra.");
           return;
       }
       try{
           const url = `https://projetodepesquisa.vercel.app/api/pos-autenticacao`;
           const data = {
               name:name,
               password:password,
               gender:gender,
               period:period,
               registration:registration,
               city:city,
               state:state,
               institution:institution,
               passwordNew:passwordNew
   
           };
           const response = await fetch(url, {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify(data)
           });
           if (!response.ok) {
               const errorData = await response.json();
               console.error('Error:', errorData.message);
               alert('Erro: ' + errorData.message);
               return;
           }
           try {
               const responseData = await response.json();
               alert('Cadastro realizado com sucesso!');
               window.location.href = "../html/login.html"
           } catch (error) {
               console.error('JSON parse error:', error);
               alert('Ocorreu um erro ao processar a resposta do servidor.');
           }

       } catch (error) {
           console.error('Fetch error:', error);
           alert('Ocorreu um erro ao tentar cadastrar. Por favor, tente novamente.');
       }
   })
   function validarPassword(password){
       let passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
       return passwordRegex.test(password);
   }
})
function convertDateFormat(dateStr) {
   const datePattern = /^\d{4}-\d{2}-\d{2}$/;
   if (!datePattern.test(dateStr)) {
       console.error("Formato de data inválido.");
       return null;
   }

   const [year, month, day] = dateStr.split('-');

   return `${day}/${month}/${year}`;
}