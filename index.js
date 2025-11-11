const { readFileSync } = require('fs');

    function formatarMoeda(valor){
      return new Intl.NumberFormat("pt-BR",
        { style: "currency", currency: "BRL",
          minimumFractionDigits: 2 }).format(valor/100);
    }
    function getPeca(pecas, apre){
      return pecas[apre.id];
    }

    function calcularCredito(apre){
      // créditos para próximas contratações
      let creditos = 0
      creditos += Math.max(apre.audiencia - 30, 0);
      if (getPeca(pecas,apre).tipo === "comedia") 
         creditos += Math.floor(apre.audiencia / 5);
      return creditos;
    }

    function calcularTotalFatura(fatura){
      return fatura.apresentacoes.reduce((total, apre) => total + calcularTotalApresentacao(apre), 0)
    }    
    
    function calcularTotalCreditos(fatura){
      return fatura.apresentacoes.reduce((total, apre) => total + calcularCredito(apre), 0)
    }

    function calcularTotalApresentacao(apre){
      let total = 0;
      switch (getPeca(pecas,apre).tipo) {
        case "tragedia":
          total = 40000;
          if (apre.audiencia > 30) {
            total += 1000 * (apre.audiencia - 30);
          }
          return total;
        case "comedia":
          total = 30000;
          if (apre.audiencia > 20) {
            total += 10000 + 500 * (apre.audiencia - 20);
          }
          total += 300 * apre.audiencia;
          return total;
        default:
          throw new Error(`Peça desconhecia: ${getPeca(pecas,apre).tipo}`);
      }
    } 


function gerarFaturaStr (fatura, pecas) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${getPeca(pecas,apre).nome}: ${formatarMoeda(calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(fatura))}\n`;
    faturaStr += `Créditos acumulados: ${calcularTotalCreditos(fatura)} \n`;
    return faturaStr;
  }

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
