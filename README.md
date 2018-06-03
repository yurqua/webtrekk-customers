# webtrekk-customers
JavaScript Developer Challenge

[Demo](https://yurqua.github.io/)

* Install dependencies with `npm i` or `yarn install`
* Run development version with `npm start` or `yarn start`

* The app uses my Firebase project and exposes the API key. If you want to setup your own instance of the database, create a web project, and update the `..\src\firebase.js` with your own Firebase settings.
* `..\webtrekk-customers-initial-data.json` contains the initial data you may want to import into your Firebase instance

## General comments
I do realize I have shifted from the original task. Sometimes this is caused by the lack of time for implementing a feature but mainly this is because I was trying to concentrate on using my strong sides.
There are couple of details I would like to bring attention to: 
* An avatar from the open API substitutes here the real photos handling. The API provides images of two genders only, so for now the 'Other' state remains only partly supported
* Unlike birthday date, the 'Last contact date' is easier to read when it's provided in the '...time ago' format

## Should I have more time for the app, I would
* Implement a post-confirmation UX-pattern where the user gets immediate result of its click-action but is able to undo it immedeately after
* As a 'would' kind of feature, it would be nice to warn about the upcoming birthdays with a special 'soon' label
* On a 'Client profile' page it would also be convinient to have a kind of 'Just contacted' button that would set the 'Last contact date' value to the current moment. Seems the expected user workflow would benefit from this. Also, it would make sense to keep history of such events 
