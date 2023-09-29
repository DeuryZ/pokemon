export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
export  async function randomPokemon(res, myContent) {
    for (let index = 0; index < 10; index++) {
        let randomNum=getRandomInt(100);
        const element = res.results[randomNum];
        let poke = await (await fetch(`${element.url}`)).json();
        myContent.insertAdjacentHTML("beforeend", `
        <div class="pokemonTypeContainer" pokeName="${element.name}" pokePhoto="${poke.sprites.front_default}">
        <h1>${element.name}</h1>
        <img src="${poke.sprites.front_default}" alt="">
        <p>Type: ${poke.types[0].type.name}</p>
        </div>
        `);
    }
}
export async function findTypePokemon(res){
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
}