# Populate Time Table for a DW

Automation script that populate an SQL Table with `TIME` attributes. It will populate the following columns:

- Year
- Month
- Day
- Quarter
- Week

## Getting Started

Make sure you have the latest version of Node installed.

Clone this repo on your local machine.

NOTE: Flags are optional. Default values are as follow:

- tablename = `time` [This will be reflected on your string queries]
- amount = 1 [how many string queries will be created]
- startyear = 2015 [random dates will start from the specified year]


```bash
# install all dependencies
npm install

# run the application, listening on port 8080.
node index.js --tablename=time --amount=25 --startyear=2018

```
