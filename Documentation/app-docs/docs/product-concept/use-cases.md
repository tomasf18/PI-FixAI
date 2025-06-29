---
id: use-cases
title: Use Cases
sidebar_label: Use Cases
sidebar_position: 4
---

The following figure illustrates the use case model of the entire system, comprising two primary packages: the mobile application package and the desktop application package. These packages respectively represent the usage of the mobile and desktop applications.

![Use Case Model](../../static/img/use-cases/use-case-model.png)

As it can be seen, a citizen will only use the mobile application, while the city control operator solely interacts with the desktop application. The following subsections provide a description for each of the use cases in each package.

## Mobile Application

The mobile application use case diagram, next figure, shows the several activities the citizen can perform on their smartphone. The following list describes each use case:

![Mobile Application Use Case](../../static/img/use-cases/use-case-mobile.png)

- **Report an Occurrence**  
  Allows the citizen to submit an incident report using the smartphone camera and an internet connection. When the user finds an incident, he opens the app and easily takes a picture of the problem. Then, an AI-generated description and category are displayed, and the user may edit or leave the report as is before submitting it.

- **View Occurrences Stats**  
  When opening the app's Home screen, a list of statistics is displayed to users. These include the total number of reported incidents, as well as how many are pending, in progress, and resolved. This statistics list will not be updated until the citizen opens the mobile application while connected to the internet. The list of stats appears when this view of the app is accessed.

- **View Occurrences Map**  
  Allows the citizen to see all his past reports, on a map view, where he can easily press the incident on the map and navigate to the incident details.

- **View Occurrences List**  
  Similar to the View Occurrences Map, but with a different layout. Here, the citizen can see all their past occurrences in a list view. Each list item links to the incident details page. To enhance usability, the citizen can also filter reports by status: pending, in progress, and resolved.

- **View Occurrence Details**  
  Here, the citizen can see the details of a specific report. The details include the report's category name, submission date, status, location, and an AI-generated description.

## Desktop Application

The desktop application use case diagram, the following figure, shows the activities the city control operator can perform on their computer. The following list describes each use case:

![Desktop Application Use Case](../../static/img/use-cases/use-case-desktop.png)

- **View Incidents Stats**  
  When opening the desktop app's Home screen, a list of statistics is displayed to the city control operator. These include the total number of reported incidents by category, as well as how many are pending, in progress, and resolved. This statistics list will not be updated until the operator opens the web application while connected to the internet. The list of stats appears when this view of the app is accessed.

- **View Incidents Map**  
  Allows the operator to see all incidents on a map view, where they can easily tap on an incident and navigate to its details. They can also filter by category and select multiple categories.

- **View Incident Details**  
  In this section, the operator can access detailed information about a specific incident, including all associated occurrences. For each occurrence, the system displays the submission date, the AI-generated description, and other relevant metadata. Additionally, the operator can view the overall category and current resolution status of the incident.

- **Update Incident Status**  
  Enables the operator to modify the status of an incident, transitioning it between pending, in progress, and resolved based on its current stage.
