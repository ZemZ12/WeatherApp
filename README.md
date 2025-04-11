# WeatherApp

## Deploying WeatherX
 To deploy WeatherX please download the contents of the git to your local machine.
 Then please open two command prompts and go to the directory that is housing the WeatherX files.
 Have one of your command prompts be in the base directory .../WeatherApp and the second command prompt in .../WeatherApp/frontend.
 Now please run `npm start` in the command prompt that is pointing to the base directory. This will start the backend processes.
 Then run `npm run dev` in the command prompt that is pointing to the frontend folder. This will start the website's frontend allowing you to access WeatherX through localhost.

## AI CITATION
 During the development of the backend we used chatGPT to assist in the understanding, development, and most importantly debugging of the program. ChatGPT was used mostly as a rubber duck of sorts which helped <
 assure us that we were on the right path. Some of the prompts included:
 ```
  Does this implementation of navigate sucessfuly redirect the user back to the home page of the website?
  Do you know of the mongoose command .save() and how do I point the save command to go to specific tables?
  So when the user sucessfully logs on to the weather app we should store the JWT token in local storage and call it when needed? Is that a safe and correct implementation idea?
  What is the opposite of the mongoose save method?
```
 ChatGPT was used to help grow our understanding of how backend development works and how to facilitate the connection between backend and frontend. As a result it was used in many of the backend files as we 
 encountered new problems that we had not encountered previously. We used chatGPT as a bouncing board to make sure that our logic was on the right track _before_ writing the APIs and connections. 
