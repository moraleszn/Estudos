let dolar;
let usdInput = document.querySelector("#usd");
let brlInput = document.querySelector("#brl");
let cotacaoElement = document.querySelector("#cotacao-atual");

async function atualizarCotacao() {
    try {
        const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
        const data = await response.json();
        dolar = parseFloat(data.USDBRL.bid);
        cotacaoElement.textContent = `Cotação atual: $1 = R$${dolar.toFixed(2).replace('.', ',')}`;
        if(usdInput.value && usdInput.value !== "0,00") {
            convert("usd-to-brl");
        }
    } catch (error) {
        cotacaoElement.textContent = "Cotação offline - usando valor padrão";
        console.log("Erro ao atualizar cotação:", error);
    }
}

usdInput.addEventListener("keyup", () => convert("usd-to-brl"));
brlInput.addEventListener("keyup", () => convert("brl-to-usd"));
usdInput.addEventListener("blur", () => usdInput.value = formatCurrency(usdInput.value));
brlInput.addEventListener("blur", () => brlInput.value = formatCurrency(brlInput.value));

usdInput.value = "1000,00";
convert("usd-to-brl");
atualizarCotacao();
setInterval(atualizarCotacao, 30 * 60 * 1000);

function formatCurrency(value) {
    let fixedValue = fixValue(value);
    let options = {
        useGrouping: false,
        minimumFractionDigits: 2
    };
    return new Intl.NumberFormat("pt-BR", options).format(fixedValue);
}

function fixValue(value) {
    let fixedValue = value.replace(",", ".");
    let floatValue = parseFloat(fixedValue);
    if (isNaN(floatValue)) {
        floatValue = 0;
    }
    return floatValue;
}

function convert(type) {
    if(type === "usd-to-brl") {
        let fixedValue = fixValue(usdInput.value);
        let result = fixedValue * dolar;
        result = result.toFixed(2);
        brlInput.value = formatCurrency(result);
    }

    if(type === "brl-to-usd") {
        let fixedValue = fixValue(brlInput.value);
        let result = fixedValue / dolar;
        result = result.toFixed(2);
        usdInput.value = formatCurrency(result);
    }
}