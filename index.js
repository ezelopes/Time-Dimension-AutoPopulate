const fs = require('fs');
const yargs = require('yargs');
const chance = require('chance').Chance();;

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

const timeDimension = () => {
  const arrayQuery = [];
  const columnNames = ['year', 'month', 'day', 'quarter', 'week'];
  let { tablename, amount, startyear } = yargs.argv; // time

  if (!tablename) tablename = 'time';
  if (!amount) amount = 1;
  if (!startyear) startyear = 2015;

  for(let i = 0; i < amount; i++) {
    const { day, week, month, year } = randomDate(new Date(startyear, 0, 1), new Date())
    const quarter = getQuarter(month);
    const query = `INSERT INTO ${tablename} (${columnNames.join(', ')}) VALUES ('${year}', '${month}', '${day}', '${quarter}', '${week}');`;
    arrayQuery.push(query);
  }

  fs.writeFile(`./output_files/${tablename}_populate_queries.txt`, '', () => {})

  arrayQuery.forEach(currentQuery => { 
    fs.appendFileSync(`./output_files/${tablename}_populate_queries.txt`, currentQuery.toString() + '\n');
  });
  
  return;

}


const patientsInsightsFactTable = () => {

  const hospitals = {
    1: {
      1: 1,
      2: 3,
      3: 5,
      4: 7
    },
    2: {
      5: 9,
      6: 11,
      7: 13,
      8: 15
    },
    3: {
      9: 3, 
      10: 7,
      11: 13
    },
    4: {
      12: 4,
      13: 5,
      14: 7
    },
    5: {
      15: 10,
      16: 12,
      17: 14
    },
    6: {
      18: 2,
      19: 7,
      20: 1
    },
  }

  const tablename = 'patients_insights';
  const columnNames = ['time_id', 'hospital_id', 'doctor_id', 'specialisation_id', 'inpatients_visited', ' outpatients_visited', 'patients_admitted'];
  const arrayQuery = [];

  
  
  for (let hospital_id in hospitals) {
    const doctors = hospitals[hospital_id];
    for (let doctor_id in doctors) {
      const specialisation_id = doctors[doctor_id];

      const timeRandom = 1 + Math.floor(Math.random() * 40);
      const inpatients_visited = 1 + Math.floor(Math.random() * 15);
      const outpatients_visited = 1 + Math.floor(Math.random() * 15);
      const patients_admitted = Math.floor(Math.random() * outpatients_visited);

      console.log(hospital_id, doctor_id, specialisation_id);

      const query = `INSERT INTO ${tablename} (${columnNames.join(', ')}) VALUES ('${timeRandom}', '${hospital_id}', '${doctor_id}', '${specialisation_id}', '${inpatients_visited}', '${outpatients_visited}', '${patients_admitted}');`;

      arrayQuery.push(query);
    }
  }

  fs.writeFile(`./output_files/${tablename}_populate_queries.txt`, '', () => {})

  arrayQuery.forEach(currentQuery => { 
    fs.appendFileSync(`./output_files/${tablename}_populate_queries.txt`, currentQuery.toString() + '\n');
  });

  return;
}

const patientDimension = () => {

  let { amount, gender } = yargs.argv;
  const arrayQuery = [];

  const tablename = 'patient';
  const columnNames = ['patient_name', 'gender_id', 'ethnicity_id', 'age_group_id'];

  if (!amount) amount = 1;

  for(let i = 0; i < amount; i++) {
    
    // const gender = 'female'; // or male
    const patient_name = chance.name({ nationality: 'en', gender: gender });
    const gender_id = gender === 'male' ? 1 : 2; 
    const ethnicity_id = 3 + Math.floor(Math.random() * 10);
    const age_group_id = 2 + Math.floor(Math.random() * 8);

    const query = `INSERT INTO ${tablename} (${columnNames.join(', ')}) VALUES ('${patient_name}', '${gender_id}', '${ethnicity_id}', '${age_group_id}');`;
    arrayQuery.push(query);
  }

  fs.writeFile(`./output_files/${tablename}_populate_queries.txt`, '', () => {})

  arrayQuery.forEach(currentQuery => { 
    fs.appendFileSync(`./output_files/output_files/${tablename}_populate_queries.txt`, currentQuery.toString() + '\n');
  });

  return;
}

const treatmentFactTable = () => {
  let { amount } = yargs.argv;
  const arrayQuery = [];

  const tablename = 'treatment';
  const columnNames = ['time_id', 'hospital_id', 'patient_id', 'drug_id', 'amount_drugs_used', 'treatment_cost'];

  for(let i = 91; i < 121; i++) {

    const time_id = 1 + Math.floor(Math.random() * 39);
    const hospital_id = 1 + Math.floor(Math.random() * 6);
    const patient_id = i; // 1 + Math.floor(Math.random() * 59);
    const drug_id = 1 + Math.floor(Math.random() * 7);
    
    const amount_drug_used = 1 + Math.floor(Math.random() * 15);
    const treatment_cost = 1 + Math.floor(Math.random() * 150);

    const query = `INSERT INTO ${tablename} (${columnNames.join(', ')}) VALUES ('${time_id}', '${hospital_id}', '${patient_id}', '${drug_id}', '${amount_drug_used}', '${treatment_cost}');`;
    arrayQuery.push(query);
  }

  fs.writeFile(`./output_files/${tablename}_populate_queries.txt`, '', () => {})

  arrayQuery.forEach(currentQuery => { 
    fs.appendFileSync(`./output_files/${tablename}_populate_queries.txt`, currentQuery.toString() + '\n');
  });

  return;
};

// patientDimension();
// timeDimension();
// patientsInsightsFactTable();
// treatmentFactTable();