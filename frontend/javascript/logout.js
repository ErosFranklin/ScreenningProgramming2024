const logout = document.querySelector('#logout')

logout.addEventListener('click' , ()=>{
    localStorage.clear()
    setTimeout(()=>{
        window.location.href = '../html/login.html'
    }, 1000)
})