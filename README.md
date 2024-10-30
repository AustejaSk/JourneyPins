# JourneyPins
JourneyPins is an interactive web app where users can visually track their travels by marking countries they've visited on the map and adding customizable pins to specific locations.

## Table of Contents
1. [Overview](#overview)
2. [Technologies](#technologies)
3. [Features](#features)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Login Details for Testing](#login-details-for-testing)
7. [Contributing](#contributing)
8. [Screenshots](#screenshots)
9. [License](#license)

## Overview
JourneyPins uses React Leaflet to offer users an interactive mapping experience. Users can mark the countries they’ve visited and add customizable pins to specific locations. Each pin can be categorized (e.g., landmarks, hiking spots, or museums) and personalized with a unique title and image. Users can create an account and log in with email and password.

## Technologies
- **React**: Used for building the user interface of the application.
- **React Leaflet**: Used to integrate an interactive map into the app.
- **SCSS**: Used for styling the application with nested rules and variables.
- **Vite**: Used as a build tool for a fast and efficient development environment.
- **Firebase**: Used for authentication and data storage.

## Features
- **Mark countries**: Users can mark countries they have visited on a world map by directly clicking on the country or typing its name into the control panel. They can also choose any color they want for marked countries to customize the map.
- **Add pins**: Users can add pins by right-clicking on the map, which brings up a menu to select from various categories, including hiking spots, landmarks, or museums. After choosing a category, the pin is placed, allowing users to keep track of their adventures.
- **Customize pins**: After adding a pin, users can personalize it by adding a custom title and an image, allowing them to preserve their memories associated with that location.
- **Control Panel**: Displays the total number of countries the user has marked on the map, providing a visited countries count. Users can also add a country by name, remove all selected countries, and customize the map color.
- **Responsive design**: Works seamlessly on desktop, tablet, and mobile devices.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AustejaSk/JourneyPins.git
   ```
2. Navigate to the project directory:
   ```bash
   cd JourneyPins
   ```
3. Install dependencies:
   ```bash
   npm install
    ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage
1. Open the app, sign in, or create a new account and start exploring the world map.
2. **Mark countries** by clicking on a country you’ve visited or by using the control panel on the left side to add a country by name.
3. **Remove countries** by double-clicking on the country on the map, or use the "Remove All Countries" button in the control panel to clear all selected countries from the map.
4. **Choose a custom color for your map** using the color picker in the control panel, the color updates in real-time.
5. **Add pins** to specific locations by right-clicking anywhere on the map and selecting a category from the menu.
6. For each pin, add a custom **title** and upload an image by selecting a file from your device.
7. Enjoy visualizing your travels!

## Login Details for Testing
To log in and test JourneyPins features, use the following credentials:
- **Email**: test@frontdomain.org | **Password**: test123  

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request on the original repository, describing your changes and why they should be merged.

## Screenshots
![JourneyPins](https://github.com/AustejaSk/JourneyPins/blob/main/journeypins.png?raw=true)

## License
This project is licensed under the MIT License.
