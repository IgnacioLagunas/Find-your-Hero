
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// A veces la api no funciona debido a un error de CORS, yo lo solucioné descargando una extención para el navegador.
// Por favor si no le funciona pregunteme porque a mi me funciona perfecto despues de arreglarlo.

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const input = $("input");
const searchButton = $("#search");
const randomButton = $("#random")
const responseTitle = $("#responseTitle");
const mainContainer = $("#mainContainer")
const imgContainer = $("#imgContainer img");
const infoContainer = $("#infoContainer");


const findHeroWithId = (idHero) => {
    $.ajax({
        url:`https://superheroapi.com/api/10226174593417405/${idHero}`,
        success: (heroData) =>{ 
            if(heroData["response"] == "error"){
                responseTitle.text("El id de heroe que buscas no existe.")
            }
            else{
                responseTitle.text("Heroe encontrado!")
                infoContainer.html("")
                displayInfo(heroData) 
                setChart(heroData.powerstats, heroData.name) 
            }  
        },
    });   
}


const displayInfo = ({image, name, work, appearance, biography, connections}) =>{
    let imageUrl = image.url;
    imgContainer.attr("src", imageUrl);
    infoContainer.append(` <h3>Nombre: <span>${name}</span> </h3>`)
    infoContainer.append(` <p>Nombre completo: <span> ${biography["full-name"]}</span> </p>`)
    infoContainer.append(` <p>Ocupacion: <span> ${work.occupation}</span> </p>`)
    infoContainer.append(` <p>Genero: <span>${appearance.gender}</span> </p>`)
    infoContainer.append(` <p>Raza: <span>${appearance.race}</span> </p>`)
    infoContainer.append(` <p>Alias: <span> ${biography.aliases.join(", ")}</span> </p>`)
    infoContainer.append(` <p>Conexiones: <span>${connections["group-affiliation"]}</span> </p>`)
    infoContainer.append(` <p>Publicado por: <span>${biography.publisher}</span> </p>`)
    infoContainer.append(` <p>Primera aparicion: <span>${biography["first-appearance"]}</span> </p>`)
    infoContainer.append(` <p>Altura: <span>${appearance.height[1]}</span>`)
    infoContainer.append(` <p>Peso: <span>${appearance.weight[1]}</span>`)
  
}


// Función que toma los powerstats del heroe y los arregla en un array de objetos para ocupar como dataPoints en el chart.
const setDataforChart = (stats) =>{
    let statsArray = Object.entries(stats)
    let dataReadyForChart = statsArray.map(stat =>{

        // Esto es para evitar que el chart se buggee con los null.
        if (stat[1] == "null"){stat[1] = 0;}
        
        let statObject = {
            label: stat[0],
            y: stat[1]
        }
        return statObject;
    })
    return dataReadyForChart;
}

const setChart = (stats, name) =>{
    let dataForChart = setDataforChart(stats);
    
    var chart = new CanvasJS.Chart("chartContainer", {
        theme: "dark2", // "light1", "light2", "dark1", "dark2"
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: `Stats de ${name}`
        },
        data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}",
            dataPoints: dataForChart
        }]
    });
    chart.render();
}


searchButton.click(() =>{
    responseTitle.text("")
    let id = input.val()
    isNaN(id) ? responseTitle.text("Ingrese un numero valido.") : findHeroWithId(id)  
})


// Al apretar te da un numero de 1 a 731, esto lo hice solamente por comodidad,
// ya que era tedioso estar buscando los heroes id por id.

randomButton.click(()=>{
    responseTitle.text("")
    let id = Math.floor((Math.random()*731)+1);
    input.val(id);
    findHeroWithId(id) 
})

