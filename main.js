
let myContent = document.querySelector(".content");
let myContentSearch = document.querySelector(".contentSearch");
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
addEventListener("DOMContentLoaded", async() => {
    let res = await (await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")).json();
    for (let index = 0; index < 10; index++) {
        let randomNum=getRandomInt(100);
        const element = res.results[randomNum];
        let poke = await (await fetch(`${element.url}`)).json();
        myContent.insertAdjacentHTML("beforeend", `
        <div class="pokemonTypeContainer" pokeName="${element.name}" pokePhoto="${poke.sprites.front_default}">
        <h1>${element.name}</h1>
        <img src="${poke.sprites.front_default}" alt="">
        <p>Type: ${poke.types[0].type.name}</p>    
    `);
    }
    let allTypesPokemon = ['grass', 'poison', 'fire', 'flying', 'water', 'bug', 'normal', 'electric', 'ground', 'fairy', 'fighting', 'psychic', 'rock', 'steel', 'ice', 'ghost', 'dragon', 'dark'];
    /*for (let i = 0; i < res.results.length; i++) {
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
            console.log(allTypesPokemon)
            break;
        }
    }*/
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
                res.pokemon.map(async(data)=>{
                    let resImg=(await (await fetch(`${data.pokemon.url}`)).json())?(await (await fetch(`${data.pokemon.url}`)).json()):data.results[0].url;
                    myContentSearch.insertAdjacentHTML("beforeend", `
                    <div class="pokemonTypeContainer" pokeName="${data.pokemon.name}" pokePhoto="${resImg.sprites.front_default}">
                    <h1>${data.pokemon.name.split('-').join(' ')}</h1>
                    <img src="${resImg.sprites.front_default}" alt="">
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
            ${res.stats.map(data => `<input type="range" class="range" value="${data.base_stat}"><label><b idBase="${data.stat.name}">${data.base_stat}</b> ${data.stat.name} </label><br>`
                ).join("")}
            `,
        imageWidth: "80%",
        imageHeight: "80%",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            let pokedatos = [res.stats.map(data => data.base_stat), res.stats.map(data => data.stat.name)];
            console.log("pokedatos:", pokedatos)
        Swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {
            console.log("no save")
        Swal.fire('Changes are not saved', '', 'info')
        }
    })
    }
    if (e.target.matches(".range")){
        let val=e.target.value
        console.log(e.target.nextElementSibling.querySelector("b").getAttribute("idBase"))
        e.target.nextElementSibling.querySelector("b").textContent = val;
    }
})
