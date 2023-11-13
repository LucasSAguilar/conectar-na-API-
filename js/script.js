const url = 'https://jsonplaceholder.typicode.com/posts'


const paginaInicial = document.querySelector('#paginaInicial')
const alertaInicio = document.querySelector('#alertaInicio')


const botaoAviso = document.querySelector('#botaoAviso')
const loadingElement = document.querySelector('#loadingElement')
const postsContainer = document.querySelector('#postsContainer')

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");


// Definindo parametros da URL
const getURLParams = new URLSearchParams(window.location.search);
const postId = getURLParams.get('id')


// Capturando posts
async function getAllPosts() {


    const response = await fetch(url)
    console.log(response);

    const dados = await response.json()
    console.log(dados);

    loadingElement.classList.add('hidden')

    dados.map((post) => {
        const div = document.createElement('div')
        const titulo = document.createElement('h2')
        const paragrafo = document.createElement('p')
        const link = document.createElement('a')

        titulo.innerHTML = post.title
        paragrafo.innerHTML = post.body
        link.innerHTML = 'Ler'
        link.setAttribute('href', `post.html?id=${post.id}`)
        link.setAttribute('id', 'acessarPost')

        div.appendChild(titulo)
        div.appendChild(paragrafo)
        div.appendChild(link)
        postsContainer.appendChild(div)
    })
}


// Pegar post unico 
async function getOnePost(id) {
    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ])

    const dataPost = await responsePost.json()
    const dataComments = await responseComments.json()

    loadingElement.classList.add('hidden')
    postPage.classList.remove('hidden')

    const title = document.createElement("h1");
    const body = document.createElement("p");

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    postContainer.appendChild(title);
    postContainer.appendChild(body);

    dataComments.map((comment) => {
        createComment(comment);
    });
}

function createComment(comment) {
    const div = document.createElement("div");
    const email = document.createElement("h3");
    const commentBody = document.createElement("p");

    email.innerText = comment.email;
    commentBody.innerText = comment.body;

    div.appendChild(email);
    div.appendChild(commentBody);
    commentsContainer.appendChild(div);
}




// Chamando funções de cada URL
!postId ? getAllPosts() : getOnePost(postId);


// Adicionar comentario no post

commentForm.addEventListener('submit', (e) => {
    e.preventDefault()

    let comment = {
        email: emailInput.value,
        body: bodyInput.value
    };
    comment = JSON.stringify(comment);
    console.log(comment);
    postComment(comment)
})


async function postComment(comment) {
    const response = await fetch(`${url}/${postId}/comments`, {
        method: 'POST',
        body: comment,
        headers: {
            'Content-type': 'application/json'
        },
    });

    const data = await response.json();
    createComment(data);
    alert('Comentário enviado com sucesso!')
}
