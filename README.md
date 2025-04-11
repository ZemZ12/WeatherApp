# WeatherApp

## Deploying WeatherX
 To deploy WeatherX please download the contents of the git to your local machine.<br>
 Then please open two command prompts and go to the directory that is housing the WeatherX files.<br>
 Have one of your command prompts be in the base directory .../WeatherApp and the second command prompt in .../WeatherApp/frontend.<br>
 Now please run `npm start` in the command prompt that is pointing to the base directory. This will start the backend processes.<br>
 Then run `npm run dev` in the command prompt that is pointing to the frontend folder. This will start the website's frontend allowing you to access WeatherX through localhost.<br>

## AI CITATION BACKEND
 During the development of the backend we used chatGPT to assist in the understanding, development, and most importantly debugging of the program. ChatGPT was used mostly as a rubber duck of sorts which helped 
 assure us that we were on the right path. <br>
 Some of the prompts included:
 ```
  1. Does this implementation of navigate sucessfuly redirect the user back to the home page of the website?
  2. Do you know of the mongoose command .save() and how do I point the save command to go to specific tables?
  3. So when the user sucessfully logs on to the weather app we should store the JWT token in local storage and call it when needed? Is that a safe and correct implementation idea?
  4. What is the opposite of the mongoose save method?
  5. How do I print a newline in a git readme file?
```
 ChatGPT was used to help grow our understanding of how backend development works and how to facilitate the connection between backend and frontend. As a result it was used in many of the backend files as we 
 encountered new problems that we had not encountered previously. We used chatGPT as a bouncing board to make sure that our logic was on the right track _before_ writing the APIs and connections. 
## AI CITATION FRONTEND
In the Frontend we used ChatGPT to assist us in our development process and debugging issues that comes up during the development.
Some of the Prompts that we used in ChatGPT are:
```
1. How do I display form validation errors below each input using Chakra UI and React Hook Form?
2. How am i to add a login logic (api)
3. Give me an example of a Chakra UI Alert component for form submission success/failure
4. How do I make a Chakra UI Grid layout responsive across mobile, tablet, and desktop?
```
