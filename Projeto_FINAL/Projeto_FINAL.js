// ----- FUNCTIONS -----//

// solicita recursos necessários (prompt/jSON)

const prompt = require("prompt-sync")();
const activityList = require("./activities.json");

// ----- FORMAT FUNCTIONS ----- TODO: REMOVE UNUSED FUNCTIONS ⚠

/* formata o texto como título. ex:

------------
example text
------------

*/

const formatToTitle = (text, separator = "-") => {
  let separatorLine = "";

  for (i = 0; i < text.length; i++) {
    separatorLine = separatorLine.concat(separator);
  }
  return `\n${separatorLine}\n${text}\n${separatorLine}\n`;
};

// formata o prompt em linha única ex: > message (prompt)

const formatPrompt = (message) => prompt(`> ${message} `);

/* formata o prompt em múltiplas linhas. ex: 
  > message 
  > (prompt)
  */

const formatPromptMultipleLines = (message) => {
  console.log(message);
  return prompt(`> `);
};

// ----- VALIDATION FUNCTIONS -----

// impede o input de string vazia

const validatePromptString = (message, errorMessage = "INVÁLIDO") => {
  while (true) {
    let string = formatPromptMultipleLines(message);

    if (string.length > 0) {
      return string;
    }
    console.log(`\n${errorMessage}\n`);
  }
};

// valida número inteiro >= 0

const validatePromptPositiveInt = (message, errorMessage = "INVÁLIDO") => {
  while (true) {
    let num = formatPromptMultipleLines(message);

    if (!isNaN(num) && num >= 0 && num % 1 == 0) {
      return num;
    }
    console.log(errorMessage);
  }
};

// valida número inteiro entre min e max (inclusice min e max)

const validatePromptIntMinMax = (
  message,
  max,
  min = 0,
  errorMessage = "INVÁLIDO"
) => {
  while (true) {
    let num = formatPromptMultipleLines(message);

    if (!isNaN(num) && num >= min && num <= max && num % 1 == 0) {
      return num;
    }
    console.log(errorMessage);
  }
};

// ----- OTHER FUNCTIONS -----

// retorna número inteiro aleatório entre min e max (inclusive min e max)

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
};

// ----- CODE START -----

// define objeto player (jogador): chaves / valores iniciais / métodos

const player = {
  // TODO: build modelJobs object/jSON
  name: "",
  moneyOwned: 0,
  needs: {
    nutrition: 5,
    energy: 5,
    hygiene: 5,
    toilet: 5,
    fun: 5,
    social: 5,
  },

  doActivity: function (index) {
    this.moneyOwned -= activityList[index].cost; // atualiza a carteira: ganhos/gastos

    minutesElapsed += activityList[index].timeToComplete; // atualiza o relógio

    // atualiza os atributos do jogador

    this.needs.nutrition += activityList[index].needsModification.nutrition;
    this.needs.energy += activityList[index].needsModification.energy;
    this.needs.hygiene += activityList[index].needsModification.hygiene;
    this.needs.toilet += activityList[index].needsModification.toilet;
    this.needs.fun += activityList[index].needsModification.fun;
    this.needs.social += activityList[index].needsModification.social;

    // garante que o valor máximo do atributo seja 5

    if (this.needs.nutrition > 5) this.needs.nutrition = 5;
    if (this.needs.energy > 5) this.needs.energy = 5;
    if (this.needs.hygiene > 5) this.needs.hygiene = 5;
    if (this.needs.toilet > 5) this.needs.toilet = 5;
    if (this.needs.fun > 5) this.needs.fun = 5;
    if (this.needs.social > 5) this.needs.social = 5;
  },
};

// define: calendário e relógio

let daysElapsed = 0;
let hoursElapsed = 5;
let minutesElapsed = 0;

// define os períodos do dia

let period = "";

if (hoursElapsed >= 5 && hoursElapsed < 12) {
  period = "manhã";
} else if (hoursElapsed >= 12 && hoursElapsed < 18) {
  period = "tarde";
} else {
  period = "noite/madrugada";
}

// condição para finalizar o jogo

let endGame = false;

if (daysElapsed > 7) {
  endGame = true;
}

// ----- GAME START -----

let gameName = formatToTitle("NOME DO JOGO!"); // TODO: define game name

// TELA INCIAL

console.clear();

console.log(gameName);

player.name = validatePromptString(
  "Qual é o seu nome?",
  "O nome não pode ser vazio!"
); // adiciona o nome do jogador no objeto player

console.clear();

// TELA PRINCIPAL

let weekDays = [
  "Segunda Feira",
  "Terça Feira",
  "Quarta Feira",
  "Quinta Feira",
  "Sexta Feira",
  "Sábado",
  "Domingo",
];

// repete a escolha da atividade até o fim do jogo

while (!endGame) {
  // avança o relógio em minutos/hotas

  if (minutesElapsed >= 60) {
    minutesElapsed -= 60;
    hoursElapsed++;
  }

  if (hoursElapsed >= 24) {
    hoursElapsed -= 24;
    daysElapsed++;
  }

  let today = weekDays[daysElapsed];
  let timeNow = `${hoursElapsed.toString().padStart(2, "0")}:${minutesElapsed.toString().padStart(2, "0")}`; //FIXME: prettier

  console.log(`${gameName}
  📆 DIA ${daysElapsed + 1} | ${today} | 🕑 ${timeNow} (${period}) 
  
  Nutrição: ${player.needs.nutrition}    Higiene: ${
    player.needs.hygiene
  }   Diversão: ${player.needs.fun}
   Energia: ${player.needs.energy}   Banheiro: ${
    player.needs.toilet
  }     Social: ${player.needs.social}
  
  `);

  // TODO: adicionar atividades à lista

  let activityChoice = validatePromptPositiveInt("O que você deseja fazer?");

  player.doActivity(activityChoice);

  console.clear();
}
