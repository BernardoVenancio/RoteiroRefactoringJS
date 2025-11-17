const { readFileSync } = require('fs');

    function formatarMoeda(valor){
      return new Intl.NumberFormat("pt-BR",
        { style: "currency", currency: "BRL",
          minimumFractionDigits: 2 }).format(valor/100);
    }

    class Repositorio {
      constructor() {
        this.pecas = JSON.parse(readFileSync('./pecas.json'));
      }

      getPeca(apre) {
        return this.pecas[apre.id];
      }
    }

    class ServicoCalculoFatura {

      constructor(repo) {
        this.repo = repo;
      }

      calcularCredito(apre) {
        // créditos para próximas contratações
        let creditos = 0
        creditos += Math.max(apre.audiencia - 30, 0);
        if (this.repo.getPeca(apre).tipo === "comedia") 
           creditos += Math.floor(apre.audiencia / 5);
        return creditos;
      }

      calcularTotalCreditos(apresentacoes) {
        return apresentacoes.reduce((total, apre) => total + this.calcularCredito(apre), 0)
      }

      calcularTotalApresentacao(apre) {
        let total = 0;
        switch (this.repo.getPeca(apre).tipo) {
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
            throw new Error(`Peça desconhecia: ${this.repo.getPeca(apre).tipo}`);
        }
      }

      calcularTotalFatura(apresentacoes) {
        return apresentacoes.reduce((total, apre) => total + this.calcularTotalApresentacao(apre), 0)
      }
    } 

function gerarFaturaHTML (fatura, calc) {
  /*
  let faturaHTML = `<html>\n`;
  faturaHTML += `<p> Fatura ${fatura.cliente} </p>\n`;
  faturaHTML += "<ul>\n";
  
  for (let apre of fatura.apresentacoes) {
      faturaHTML += `  <li>  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos) </li>\n`;
  }
  
  faturaHTML += "</ul>\n";
  faturaHTML += `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))} </p>\n`;
  faturaHTML += `<p> Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} </p>\n`;
  faturaHTML += "</html>";
  
  return faturaHTML;
  */
}

function gerarFaturaStr (fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
    return faturaStr;
  }

const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);

// console.log("-----------------------------------------")
// const faturaHTML = gerarFaturaHTML(faturas, pecas, calc);
// console.log(faturaHTML);