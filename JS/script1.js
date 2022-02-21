let numeroDeAcertos = 0;
let informacoesDoQuiz = {id:"",title:"",image:"",questions:"",levels:""}
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
    QUIZZESBOX.innerHTML += `<div class="quiz" onclick="alternarDaTela1ParaATela2(children)">
    <div class="imagemQuiz">
        <img src="${quizBox.image}" alt="Imagem dos Simpsons"/>
    </div>
    <div class="textoQuiz">
        <p>${quizBox.title}</p>
    </div>
    <div class="idQuiz offTela1">${quizBox.id}</div>
</div>`
}

function alternarDaTela1ParaATela2(divQuiz){
    let idQuiz = divQuiz[2].innerHTML;
    const PROMISSE = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuiz}`);
    PROMISSE.then(criarPaginaDoQuiz);
    const TELA1 = document.querySelector(".boxTela1");
    const TELA2 = document.querySelector(".boxTela2");
    TELA1.classList.toggle("offTela1");
    TELA2.classList.toggle("offTela2");
}
function criarPaginaDoQuiz(dadosDoQuiz){
    let quizInfo = dadosDoQuiz.data;
    informacoesDoQuiz = quizInfo;
    const BOXTELA2 = document.querySelector(".boxTela2");
    
    BOXTELA2.innerHTML = 
    `<div class="bannerDoQuiz" 
        style=" width: 100vw;
        height: 30vh;
        background-image: url(${quizInfo.image});
        background-size: cover;
        display:flex;
        justify-content:center;
        align-items: center;">
        <div class="textoDoBanner">
            <p>${quizInfo.title}</p>
        </div>
    </div>`
    for(let i = 0; i < (quizInfo.questions).length; i++){
        BOXTELA2.innerHTML += 
        `<div class="estruturaDoQuiz perguntasDoQuiz">
            <div class="textoDoQuiz" style="background-color:${((quizInfo.questions)[i]).color};">
                <p>${((quizInfo.questions)[i]).title}</p>
            </div>
            <div class="respostaS">
            </div>
        </div>`
    }
    let respostaS = document.querySelectorAll(".respostaS");
    randomizarRespostas(quizInfo.questions);
    for(let i = 0; i < respostaS.length; i++){
        for(let j = 0; j < ((quizInfo.questions)[i].answers).length; j++){
            ((quizInfo.questions)[i].answers).sort(randomizarRespostas);
            (respostaS[i]).innerHTML += 
            `<div class="resposta" onclick="verificarResposta(this, parentNode)">
                <img src="${((quizInfo.questions)[i].answers[j]).image}"/>
                <p> ${((quizInfo.questions)[i].answers[j]).text} </p>
                <div class="validacao offTela2">${((quizInfo.questions)[i].answers[j]).isCorrectAnswer}</div>
                <div class="id offTela2"> ${j} </div>
            </div>`;
        }
    }
}
function randomizarRespostas() { 
	return Math.random() - 0.5; 
}
function verificarResposta(elemento, elementoPai){
    
    elemento.classList.add("respostaSelecionada");

    let arrayElementoPai = [];
    let arrayElemento = [];
    

    for(let i = 0; i < elemento.childNodes.length; i++){
        if(i % 2 != 0){
            arrayElemento.push(elemento.childNodes[i]);
        }
    }
    for(let i = 1; i < elementoPai.childNodes.length; i++){
        arrayElementoPai[(i - 1)] = elementoPai.childNodes[i];
    }
    for(let i = 0; i < arrayElementoPai.length; i++){
        if(arrayElementoPai[i].classList.contains("respostaSelecionada") === false){
            arrayElementoPai[i].classList.add("respostaNaoSelecionada");
        }
    }
    for(let i = 0; i < arrayElementoPai.length; i++){
        if(arrayElementoPai[i].childNodes[5].innerHTML == "true"){
            arrayElementoPai[i].classList.add("respostaCerta");
            numeroDeAcertos = numeroDeAcertos + 1;

        }else{
            arrayElementoPai[i].classList.add("respostaErrada");
        }
    }
    console.log(arrayElementoPai);
    for(let i = 0; i < arrayElementoPai.length; i++){
        arrayElementoPai[i].onclick=null;
        console.log(arrayElementoPai[i]);
    }
    console.log(arrayElementoPai);

    
    let proximoElemento = (elementoPai.parentNode).nextSibling
    setTimeout(rolarParaAProximaPergunta, 2000, proximoElemento);

    let numeroDePerguntas = (((elementoPai.parentNode).parentNode).childNodes).length - 1
    calcularPontuacaoDoQuiz(numeroDeAcertos, numeroDePerguntas);
}

function rolarParaAProximaPergunta(elemento){
    elemento.scrollIntoView();
}
function calcularPontuacaoDoQuiz(numeroDeAcertos, numeroDePerguntas){
    let porcentagemDeAcertos = Math.ceil((numeroDeAcertos/numeroDePerguntas)*100);
    criarPaginaFinalDoQuiz(porcentagemDeAcertos);
}
function criarPaginaFinalDoQuiz(porcentagemDeAcertos){
    elemento = document.querySelector(".boxTela2");
    let arrayLevels = [];
    for(let i = 0; i < informacoesDoQuiz.levels.length; i++){
        arrayLevels[i] = ((informacoesDoQuiz.levels)[i]).minValue;
    }
    arrayLevels.sort(function(a,b){
        if(a > b) return 1;
        if(a < b) return -1;
        return 0;
    });
    for(let i = 0; i < arrayLevels.length; i++){
        if((arrayLevels[i + 1] != null) & (porcentagemDeAcertos > arrayLevels[i] & porcentagemDeAcertos < arrayLevels[i + 1])){
            elemento.innerHTML += `<div class="mensagemFinalDoQuiz">
                <div class="textoDoQuiz laranja">
                    <p>${informacoesDoQuiz.levels}</p>
                </div>
                <img src="Imagens/Figma/Tela2/bruxaocabuloso.png"/>
                <div class="mensagemFinal">
                    <p>Parabéns Potterhead! Bem-vindx a Hogwarts, aproveite o loop infinito de comida e clique no botão abaixo para usar o vira-tempo e reiniciar este teste.</p>
                </div>
            </div>
            <div class="footerDoQuiz">
                <button class="reiniciarQuiz">Reiniciar Quizz</button>
                <button class="voltarPraHome">Voltar pra home</button>
            </div>`
        }else if(porcentagemDeAcertos == arrayLevels[i]){
            
        }
    }
}