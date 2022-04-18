# consumerTrackProject

## Running the program

the program takes one additional argument after node index.js which is the full path name to the log file on your computer.

right now the .env file has my own MaxMind GeoLite2 credentials but its limited to 1000 API calls a day so if you are gonna test it on
a log file with more than 1000 lines i suggest maybe using your own.

first you should git clone this repository on your computer by running git clone https://github.com/michaellosev/consumerTrackProject.git 

then cd into project folder, run npm install, and add the .env file that I sent along

to run the program run the command node index.js 'Full PathName To File'