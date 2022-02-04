const input = $("input");
const searchButton = $("#search");
const randomButton = $("#random");
const mainSection = $(".main__section");
const responseTitle = $("#responseTitle");

const findHeroWithId = (idHero) => {
  $.ajax({
    url: `https://superheroapi.com/api/10226174593417405/${idHero}`,
    success: (heroData) => {
      mainSection.html("");

      if (heroData["response"] == "error") {
        responseTitle.text("El heroe que buscas no existe.");
      } else {
        if ("results" in heroData) {
          responseTitle.text("Heroes encontrados!");
          let { results } = heroData;
          console.log(results);
          for (i = 0; i < results.length; i++) {
            createHeroSection(i);
            displayInfo(results[i], i);
            setChart(results[i].powerstats, results[i].name, i);
          }
        } else {
          responseTitle.text("Heroe encontrado!");
          createHeroSection(0);
          displayInfo(heroData, 0);
          setChart(heroData.powerstats, heroData.name, 0);
        }
      }
    },
  });
};

const createHeroSection = (index) => {
  console.log(`funcionando index ${index}`);
  console.log(mainSection);

  mainSection.append(
    `<div id="heroContainer_${index}" class="main__container"></div> `
  );
  let heroContainer = $(`#heroContainer_${index}`);
  heroContainer.append(
    `<div class="card" id="card_${index}"></div>
        <div class="chart" id="chartContainer_${index}"></div>`
  );
  let card = $(`#card_${index}`);
  card.append(
    `<div class="card__photo" id="imgContainer_${index}"><img src="" alt=""></div>
        <div class="card__content" id="infoContainer_${index}"></div>`
  );
};

const displayInfo = (
  { image, name, work, appearance, biography, connections },
  index
) => {
  let imageUrl = image.url;
  let imgContainer = $(`#imgContainer_${index} img`);
  console.log(imgContainer);
  let infoContainer = $(`#infoContainer_${index}`);
  imgContainer.attr("src", imageUrl);
  infoContainer.append(` <h3>Nombre: <span>${name}</span> </h3>`);
  infoContainer.append(
    ` <p>Nombre completo: <span> ${biography["full-name"]}</span> </p>`
  );
  infoContainer.append(` <p>Ocupacion: <span> ${work.occupation}</span> </p>`);
  infoContainer.append(` <p>Genero: <span>${appearance.gender}</span> </p>`);
  infoContainer.append(` <p>Raza: <span>${appearance.race}</span> </p>`);
  infoContainer.append(
    ` <p>Alias: <span> ${biography.aliases.join(", ")}</span> </p>`
  );
  infoContainer.append(
    ` <p>Conexiones: <span>${connections["group-affiliation"]}</span> </p>`
  );
  infoContainer.append(
    ` <p>Publicado por: <span>${biography.publisher}</span> </p>`
  );
  infoContainer.append(
    ` <p>Primera aparicion: <span>${biography["first-appearance"]}</span> </p>`
  );
  infoContainer.append(` <p>Altura: <span>${appearance.height[1]}</span>`);
  infoContainer.append(` <p>Peso: <span>${appearance.weight[1]}</span>`);
};

const setDataforChart = (stats) => {
  let statsArray = Object.entries(stats);
  console.log(statsArray);
  let dataReadyForChart = statsArray.map((stat) => {
    if (stat[1] == "null") {
      stat[1] = 0;
    }
    let statObject = {
      label: stat[0],
      y: stat[1],
    };
    return statObject;
  });
  return dataReadyForChart;
};

const setChart = (stats, name, index) => {
  let dataForChart = setDataforChart(stats);

  var chart = new CanvasJS.Chart(`chartContainer_${index}`, {
    theme: "dark2", // "light1", "light2", "dark1", "dark2"
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: `Stats de ${name}`,
    },
    data: [
      {
        type: "pie",
        startAngle: 25,
        toolTipContent: "<b>{label}</b>: {y}",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y}",
        dataPoints: dataForChart,
      },
    ],
  });
  chart.render();
};

searchButton.click(() => {
  responseTitle.text("Buscando...");
  mainSection.html("");
  let search = input.val();
  isNaN(search) ? (search = `search/${search}`) : search;
  findHeroWithId(search);
});

randomButton.click(() => {
  responseTitle.text("Buscando...");
  mainSection.html("");
  let id = Math.floor(Math.random() * 731 + 1);
  input.val(id);
  findHeroWithId(id);
});
