import { randomPokemon } from "./functions.js";
import { showPokemon } from "./functions.js";

let myContent = document.querySelector(".content");
let myContentSearch = document.querySelector(".contentSearch");

addEventListener("DOMContentLoaded", async() => {
    let res = await (await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")).json();
    randomPokemon(res, myContent);
    let allTypesPokemon = [
        'grass', 
        'poison', 
        'fire', 
        'flying', 
        'water', 
        'bug', 
        'normal', 
        'electric', 
        'ground', 
        'fairy', 
        'fighting', 
        'psychic', 
        'rock', 
        'steel', 
        'ice', 
        'ghost', 
        'dragon', 
        'dark'
    ];
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
                let res = await (await fetch(`https://pokeapi.co/api/v2/type/${e.target.getAttribute("idName")}`)).json();
                myContent.style.display="none";
                myContentSearch.innerHTML="";
                let defaultImg =
                "https://i.pinimg.com/originals/27/ae/5f/27ae5f34f585523fc884c2d479731e16.gif";
                res.pokemon.map(async(data)=>{
                    let resImg=(await (await fetch(`${data.pokemon.url}`)).json())?(await (await fetch(`${data.pokemon.url}`)).json()):data.results[0].url;
                    myContentSearch.insertAdjacentHTML("beforeend", `
                    <div class="pokemonTypeContainer" pokeName="${data.pokemon.name}" pokePhoto="${resImg.sprites.front_default}">
                    <h1 class="titlePokemon" pokeName="${data.pokemon.name}" >${data.pokemon.name.split('-').join(' ').toUpperCase()}</h1>
                    <img class="imgPokemon"  pokeName="${data.pokemon.name}" src="${resImg.sprites.front_default ? resImg.sprites.front_default : defaultImg}" alt="">
                    </div>
                    `);
                })
            }
        })
    })
})

document.addEventListener("click", async(e) => {

    showPokemon(e, ".imgPokemon");
    if (e.target.matches(".range")){
        let val=e.target.value
        e.target.nextElementSibling.querySelector("b").textContent = val;
    }
})
