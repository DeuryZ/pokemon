
let myContent = document.querySelector(".content");
let myContentSearch = document.querySelector(".contentSearch");
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
addEventListener("DOMContentLoaded", async() => {
    let res = await (await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")).json();
    // console.log(res.results);
    // console.log(res)
    for (let index = 0; index < 10; index++) {
        let randomNum=getRandomInt(100);
        const element = res.results[randomNum];
        // console.log(element)
        let poke = await (await fetch(`${element.url}`)).json();
        // console.log(poke.types[0].type)
        // console.log(poke.types[0].type.name)
        myContent.insertAdjacentHTML("beforeend", `
        <h1>${element.name}</h1>
        <img src="${poke.sprites.front_default}" alt="">
        <p>Type: ${poke.types[0].type.name}</p>    
    `);
    }
    let allTypesPokemon = [];
    for (let i = 0; i < res.results.length; i++) {
        let element = res.results[i].url;
        let poke = await (await fetch(`${element}`)).json();
        poke.types.map(data=>{
            if ((!allTypesPokemon.includes(data.type.name))){
                allTypesPokemon.push(data.type.name);   
            }
            else{
                return;
            }
        })
        if(allTypesPokemon.length==18){
            break;
        }
    }
    let myTypes=document.querySelector(".types");
    allTypesPokemon.map(data=>{
        myTypes.insertAdjacentHTML("beforeend", `
        <li class="type" idName="${data}">${data}</li>
        `);
    })
    let myType=document.querySelectorAll(".type");
    myType.forEach(data=>{
        data.addEventListener("click", async(e) => {
            if(e.target.matches(".type")){
                console.log(e.target.getAttribute("idName"));
                let res = await (await fetch(`https://pokeapi.co/api/v2/type/${e.target.getAttribute("idName")}`)).json();
                myContent.style.display="none";
                myContentSearch.innerHTML="";
                res.pokemon.map(async(data)=>{
                    
                    let resImg=(await (await fetch(`${data.pokemon.url}`)).json())?(await (await fetch(`${data.pokemon.url}`)).json()):data.results[0].url;
                    console.log(resImg);
                    myContentSearch.insertAdjacentHTML("beforeend", `
                    <div class="pokemonTypeContainer" pokeName="${data.pokemon.name}" pokePhoto="${resImg.sprites.front_default}">
                    <h1>${data.pokemon.name.split('-').join(' ')}</h1>
                    <img src="${resImg.sprites.front_default}" alt="">
                    <p></p>
                    </div>
                    `);
                })
            }
        })
    })
})

document.addEventListener("click", async(e) => {
    if (e.target.matches(".pokemonTypeContainer")){
        let pokeName=e.target.getAttribute("pokeName")
        let res = await (
        await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
        ).json();
        let img = res.sprites.front_default;
        let defaultImg =
        "https://i.pinimg.com/originals/27/ae/5f/27ae5f34f585523fc884c2d479731e16.gif";

        Swal.fire({
        title: `${res.name}`,
        text: "Modal with a custom image.",
        imageUrl: `${img ? img : defaultImg}`,
        html: `
            ${res.stats.map(data => `<input type="range" class="range" value="${data.base_stat}"><label><b>${data.base_stat}</b> ${data.stat.name} </label><br>`
                ).join("")}
            `,
        imageWidth: "80%",
        imageHeight: "80%",
        confirmButtonText: 'Save',
        });
    }
    if (e.target.matches(".range")){
        let val=e.target.value
        e.target.nextElementSibling.querySelector("b").textContent = val;
    }    
})
