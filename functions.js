let pokedatos = [];

export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
export async function randomPokemon(res, myContent) {
    for (let index = 0; index < 10; index++) {
        let randomNum = getRandomInt(100);
        const element = res.results[randomNum];
        let poke = await (await fetch(`${element.url}`)).json();
        let img = poke.sprites.front_default;
        let defaultImg =
            "https://i.pinimg.com/originals/27/ae/5f/27ae5f34f585523fc884c2d479731e16.gif";

        myContent.insertAdjacentHTML("beforeend", `
        <div class="pokemonTypeContainer" pokeName="${element.name}">
        <h1 class="titlePokemon" pokeName="${element.name}">${element.name.toUpperCase()}</h1>
        <img class="imgPokemon" pokeName="${element.name}" src="${img ? img : defaultImg}" alt="">
        <p>Type: ${poke.types[0].type.name}</p>
        </div>
        `);
    }
}
export async function findTypePokemon(res) {
    for (let i = 0; i < res.results.length; i++) {
        let element = res.results[i].url;
        let poke = await (await fetch(`${element}`)).json();
        poke.types.map(data => {
            if ((!allTypesPokemon.includes(data.type.name))) {
                allTypesPokemon.push(data.type.name);
            }
            else {
                return;
            }
        })
        if (allTypesPokemon.length == 18) {
            break;
        }
    }
}
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
export async function showPokemon(e, select) {
    if (e.target.matches(select)) {
        let pokeName = e.target.getAttribute("pokeName")
        let res = await (
            await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)).json();
        let img = res.sprites.front_default;
        let defaultImg = "https://i.pinimg.com/originals/27/ae/5f/27ae5f34f585523fc884c2d479731e16.gif";
        Swal.fire({
            title: `${res.name.toUpperCase()}`,
            text: "Modal with a custom image.",
            imageUrl: `${img ? img : defaultImg}`,
            html: `
            ${res.stats.map(data => `<input type="range" class="range" value="${data.base_stat}" pokeStatName="${data.stat.name}" idName="${res.name}"><label><b idBase="${data.stat.name}">${data.base_stat}</b> ${data.stat.name.toUpperCase()} </label><br>`
            ).join("")}
            `,

            imageWidth: "80%",
            imageHeight: "80%",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
        }).then((result) => {
            if (result.isConfirmed) {
                saveData()
                Swal.fire('Saved!', '', 'success')
            } else if (result.isDenied) {
                console.log("no save")
                Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }
    if (e.target.matches(".range")) {
        const idName = e.target.getAttribute("idName");
        const pokeStatName = e.target.getAttribute("pokeStatName");
        const pokeStatValue = e.target.value;

            pokedatos={"stats": 
            [
            {
                "base_stat": pokeStatValue,
                "stat": 
                {
                "name": pokeStatName
                },
                "pokeName": idName
            }
            ]
            };
        }
        console.log(pokedatos);
}

async function saveData() {
    let config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pokedatos)
    }
    let res = await (await fetch("https://650ad5b7dfd73d1fab08fcc0.mockapi.io/tabla/mokeapi", config)).json();
}

