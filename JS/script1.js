requisicaoQuizzes();

function requisicaoQuizzes(){
    const PROMISSE = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    PROMISSE.then(obterQuizzes);
}
function obterQuizzes(quizDoServidor){
    let quizBox = {id:"",tittle:"",image:"",questions:"", levels:""}
    for(let i = 0; i < quizDoServidor.data.length; i++){
        quizBox[i] = quizDoServidor.data[i];
        adicionarQuizzes(quizBox[i]);
    } 
}
function adicionarQuizzes(quizBox){
    const QUIZZESBOX = document.querySelector(".teste");
    QUIZZESBOX.innerHTML += `<div class="quiz" onclick="alternarDaTela1ParaATela2(this)">
    <div class="imagemQuiz">
        <img src="${quizBox.image}" alt="Imagem dos Simpsons"/>
    </div>
    <div class="textoQuiz">
        <p>${quizBox.tittle}</p>
    </div>
</div>`
}

/*
function alternarDaTela1ParaATela2(divQuiz){
    console.log(divQuiz);
    /*const TELA1 = document.querySelector(".boxTela1");
    const TELA2 = document.querySelector(".boxTela2");
    TELA1.classList.toggle("off");
    TELA2.classList.toggle("offTela2");
}
function criarPaginaDoQuiz(){

}*/