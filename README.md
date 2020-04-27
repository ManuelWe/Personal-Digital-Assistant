# Welcome to Gunter - your Personal Digital Assistant

![Continuous integration](https://github.com/ManuelWe/Personal-Digital-Assistant/workflows/Continuous%20integration/badge.svg)

## What can Gunter do?
Gunter is a personal digital assistant. He offers four use cases which provide a wide variety of functionality. You can access Gunter via any web browser and talk to him. Gunter will answer.

## How is Gunter build?
Gunter consists of a Node.js backend which can be found in the [Backend folder](https://github.com/dhbw-stg-tinf17a/ICC-Pr-sentation/tree/master/Backend) and a Vue.js frontend which can be found in the [Frontend folder](https://github.com/dhbw-stg-tinf17a/ICC-Pr-sentation/tree/master/Frontend).

![alt text](https://github.com/dhbw-stg-tinf17a/ICC-Pr-sentation/blob/master/Presentation/Diagrams/Gunter_Overview.png "Architectural Overview")

Gunter's dialog is implemented as simple keyword recognition, so he is only able to recognize specific commands. You can see all available commands in Gunter's help section.  
Gunter is also proactive. This means that he will send you push notifications on your device (if enabled in the settings). Push notifications notify you about an updated use case and will also work when the browser is closed.

### CI/CD
In this repository a continous integration pipeline is set up with GitHub Actions. You can check the output of the latest runs in the [Actions tab](https://github.com/dhbw-stg-tinf17a/ICC-Pr-sentation/actions). There you can also see what the test coverage for the frontend and the backend is.  

Continous Deployment is also set up. You can merge any changes on the master branch and they will be automatically deployed to [gunter.felixsz.de](https://gunter.felixsz.de/)

# Use Cases
You can find use case diagrams [here](https://github.com/dhbw-stg-tinf17a/ICC-Pr-sentation/tree/master/Presentation/Diagrams).

## Morning Routine
In the morning, most people always repeat the same set of tasks. For this use case, the assistant sends a notification to the user depending on the start of the first event in the <ins>calendar</ins>, the travel time to the first event (<ins>VVS</ins>), and the time they need to get ready (<ins>preferences</ins>). When the user clicks on the notification, the morning routine use case is opened in the web app. The user can also open the use case at any other time using the web app. After opening the use case, the assistant presents the route to the first event in the <ins>calendar</ins> (<ins>VVS</ins>) and the <ins>weather</ins> forecast for the day.  
Time of notification = start of the first event - travel time - time to get ready

**Dialog**: If the user confirms that they want to hear the daily <ins>quote</ins>, a daily quote is also presented to the user.

**Services:** preferences, calendar, VVS, weather, quote

## Personal Trainer
Many people want to do sport in their free time but often miss external motivation. For this use case, the assistant sends a notification to the user between set times (<ins>preferences</ins>) when there is a free slot in the <ins>calendar</ins>. The free slot calculation includes the travel time to the following events (<ins>VVS</ins>). When the user clicks on the notification, the personal trainer use case is opened. The user can also open the use case at any other time using the web app. After opening the use case, the assistant presents an optimal sport type to the user depending on the current <ins>weather</ins> and their preferred sport types (<ins>preferences</ins>).  
Sunny weather → running, biking, or tennis
Rainy weather → swimming, badminton, or gym

**Dialog:** If the user confirms that they want to do the presented activity, the assistant searches for a sports facility (<ins>maps</ins>) and presents the route to the sports facility (<ins>VVS</ins>) if required.  

**Services:** preferences, calendar, VVS, weather, maps

## Travel Planning
Travel is very popular, but the search for a destination is often complicated. For this use case, the assistant sends a notification before the weekend, if the user has enough free time during the weekend (<ins>calendar</ins>). When the user clicks on the notification, the travel planning use case is opened. The user can also open the use case at any other time using the web app. After opening the use case, the assistant presents an optimal travel destination depending on preferred countries of the user (<ins>preferences</ins>) and prices for a roundtrip to the destination, starting from the main station (<ins>DB</ins>). The assistant also presents the <ins>weather</ins> during the weekend at the destination.  

**Dialog:** If the user confirms that they want to travel to the presented destination, the assistant presents the route taken to the main station (<ins>VVS</ins>) and from there to the destination (<ins>DB</ins>).

**Services:** preferences, calendar, DB, VVS, weather

## Lunch Break
Many people want to explore different alternatives during their lunch breaks, but the search for restaurants is a time-consuming task. For this use case, the assistant sends a notification shortly before the lunch break. This depends on the <ins>calendar</ins> and on the preferred lunch break times (<ins>preferences</ins>). When the user clicks on the notification, the lunch break use case is opened. The user can also open the use case at any other time using the web app. After opening the use case, the assistant presents a restaurant to go to during the lunch break (<ins>maps</ins>).

**Dialog:** If the user wants to go to that restaurant during the lunch break, the assistant presents the route taken to the destination (<ins>VVS</ins>).

**Services:** preferences, calendar, VVS, maps
