/*
 * Construct a simple Portfolio class that has a collection of Stocks and a "Profit" method that receives 2 dates and returns the profit 
 * of the Portfolio between those dates. Assume each Stock has a "Price" method that receives a date and returns its price.
 * Bonus Track: make the Profit method return the "annualized return" of the portfolio between the given dates.
 */

const YEAR = 365;

function sumArray(array) {
  if (!array.length) return 0
  return array.reduce((a, b) => a + b, 0);
}

// function found in https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
const _MS_PER_DAY = 1000 * 60 * 60 * 24;

function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}


class Price {
  constructor(date, price) {
    this.date = date;
    this.price = price;
  }
}

class Stock {
  constructor(prices) {
    this.prices = prices;
  }
  Price(date) {
    const targetStockByDate = this.prices.find(price => price.date.getTime() === date.getTime())
    if (!targetStockByDate && !targetStockByDate.price) return 0;
    return targetStockByDate.price;
  }
}

class Portfolio {
  constructor(stocks) {
    this.stocks = stocks;
  }
  getStocksPricesByDate(date) {
    return this.stocks.map((stock) => stock.Price(date));
  }
  sumStocksPrices(date) {
    return sumArray(this.getStocksPricesByDate(date));
  }
  cumulativeReturn(firstDate, lastDate) {
    return this.sumStocksPrices(lastDate) - this.sumStocksPrices(firstDate);
  }
  Profit(firstDate, lastDate){
    const daysBetweenDates = dateDiffInDays(firstDate, lastDate);
    const exponent = daysBetweenDates / YEAR;
    return ((1 + this.cumulativeReturn(firstDate, lastDate)) ** (exponent)) - 1;
  }
}

function generatePrices( price1, price2) {
  let prices = []
  const firstDate = new Date(2022, 0,1);
  const lastDate = new Date(2022, 11, 31);
  for(date = firstDate; date <= lastDate; date.setDate(date.getDate() + 1)){
    const dt = new Date(date)
    const percentage = dateDiffInDays(dt, lastDate)  / YEAR;
    const price = price1 * percentage + price2 * (1 - percentage) 
    prices.push(new Price( dt , price ) );
  }
  return prices;
}

// generate price list for different stocks
const prices1 = generatePrices(200, 500)
const prices2 = generatePrices(20, 10)
const prices3 = generatePrices(10, 0)
const prices4 = generatePrices(50, 80)

const stocks = [
  new Stock(prices1),
  new Stock(prices2),
  new Stock(prices3),
  new Stock(prices4),
];
const portfolio = new Portfolio(stocks)
if (process.argv.length < 4) {
  console.error("Necesitas entregar dos fechas");
}
try{
  const startDate = new Date(process.argv[2]);
  const lastDate = new Date(process.argv[3]);
  console.log(portfolio.Profit(new Date(2022, 0, 1), new Date(2022, 0, 20)))
} catch(e) {
  console.error(e);
}
