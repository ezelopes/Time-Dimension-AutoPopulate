const yargs = require('yargs');
const fs = require('fs');

Date.prototype.getWeek = function (dowOffset) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
  
      dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
      var newYear = new Date(this.getFullYear(),0,1);
      var day = newYear.getDay() - dowOffset; //the day of week the year begins on
      day = (day >= 0 ? day : day + 7);
      var daynum = Math.floor((this.getTime() - newYear.getTime() - 
      (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
      var weeknum;
      //if the year starts before the middle of a week
      if(day < 4) {
          weeknum = Math.floor((daynum+day-1)/7) + 1;
          if(weeknum > 52) {
              nYear = new Date(this.getFullYear() + 1,0,1);
              nday = nYear.getDay() - dowOffset;
              nday = nday >= 0 ? nday : nday + 7;
              /*if the next year starts before the middle of
                the week, it is week #1 of that year*/
              weeknum = nday < 4 ? 1 : 53;
          }
      }
      else {
          weeknum = Math.floor((daynum+day-1)/7);
      }
      return weeknum;
  };

const randomDate = (start, end) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();
  let year = date.getFullYear();
  let week = date.getWeek();
  
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return { day, week, month, year };
}

const getQuarter = (month) => {
  if (month >= 1 && month <= 3) return 1; 
  else if (month >= 4 && month <= 6) return 2; 
  else if (month >= 7 && month <= 9) return 3; 
  else if (month >= 10 && month <= 12) return 4; 
}

const main = () => {
  const arrayQuery = [];
  const columnNames = ['year', 'month', 'day', 'quarter', 'week'];
  let { tablename, amount, startyear } = yargs.argv; // time

  if (!tablename) tablename = 'time';
  if (!amount) amount = 1;
  if (!startyear) startyear = 2015;

  for(let i = 0; i < amount; i++) {
    const { day, week, month, year } = randomDate(new Date(startyear, 0, 1), new Date())
    const quarter = getQuarter(month);
    const query = `INSERT INTO ${tablename} (${columnNames.join(', ')}) VALUES ('${year}', '${month}', '${day}', '${quarter}', '${week}')`;
    arrayQuery.push(query);
  }

  fs.writeFile(`./${tablename}_populate_queries.txt`, '', () => {})

  arrayQuery.forEach(currentQuery => { 
    fs.appendFileSync(`./${tablename}_populate_queries.txt`, currentQuery.toString() + '\n');
  });
  
  return;

}

main();