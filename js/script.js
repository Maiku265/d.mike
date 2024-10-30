// Function to update time and date display
function updateTime() {
    const now = new Date();
    const options = { hour: "2-digit", minute: "2-digit", hour12: false };
    const timeString = now.toLocaleTimeString([], options);
    document.getElementById("current-time").textContent = timeString;

    const dateString = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    document.getElementById("current-date").textContent = dateString;
}

// Update time immediately on load and then every second
updateTime();
setInterval(updateTime, 1000);

// Function to update battery status
function updateBatteryStatus() {
    if (navigator.getBattery) {
        navigator.getBattery().then(function (battery) {
            const batteryPercentageElement = document.getElementById("battery-percentage");
            const batteryIcon = document.getElementById("battery-icon");
            const chargingIcon = document.getElementById("charging-icon");

            function updateBatteryInfo() {
                const level = Math.round(battery.level * 100);
                batteryPercentageElement.textContent = `${level}%`;

                if (battery.charging) {
                    chargingIcon.style.display = "inline";
                    batteryIcon.textContent = "battery_charging_full";
                } else {
                    chargingIcon.style.display = "none";
                    if (level > 75) {
                        batteryIcon.textContent = "battery_full";
                    } else if (level > 50) {
                        batteryIcon.textContent = "battery_3_bar";
                    } else if (level > 25) {
                        batteryIcon.textContent = "battery_2_bar";
                    } else {
                        batteryIcon.textContent = "battery_1_bar";
                    }
                }
            }

            // Initial battery info
            updateBatteryInfo();
            battery.addEventListener("levelchange", updateBatteryInfo);
            battery.addEventListener("chargingchange", updateBatteryInfo);
        });
    } else {
        console.warn("Battery Status API not supported");
    }
}

// Function to fetch weather data
function fetchWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API key
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            fetch(url)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Weather data not available");
                    }
                    return response.json();
                })
                .then((data) => {
                    const weatherInfo = document.getElementById("weather-info");
                    const temperature = Math.round(data.main.temp);
                    const weatherDescription = data.weather[0].description;
                    weatherInfo.innerHTML = `${temperature}°C, ${weatherDescription}`;
                })
                .catch((error) => {
                    console.error("Error fetching weather data:", error);
                    document.getElementById("weather-info").innerHTML = "Unable to retrieve weather data";
                });
        }, (error) => {
            console.error("Error getting location:", error);
            document.getElementById("weather-info").innerHTML = "Unable to retrieve location data";
        });
    } else {
        console.warn("Geolocation is not supported by this browser.");
    }
}

// Show home screen on load
document.addEventListener("DOMContentLoaded", () => {
    const homeScreen = document.querySelector(".home-screen");
    const appsScreen = document.querySelector(".apps-screen");
    homeScreen.style.display = "block";

    // Event listeners for navigation
    document.getElementById("home-button").addEventListener("click", () => {
        homeScreen.style.display = "block";
        appsScreen.style.display = "none";
        // Hide other app screens
        document.querySelectorAll(".app-screen").forEach(screen => {
            screen.style.display = "none";
        });
    });

    document.getElementById("apps-button").addEventListener("click", () => {
        homeScreen.style.display = "none";
        appsScreen.style.display = "block";
    });

    // App icons event listeners
    document.getElementById("calendar-app").addEventListener("click", () => {
        appsScreen.style.display = "none";
        document.getElementById("calendar-screen").style.display = "block";
    });

    document.getElementById("phone-app").addEventListener("click", () => {
        appsScreen.style.display = "none";
        document.getElementById("phone-screen").style.display = "block";
    });

    document.getElementById("messages-app").addEventListener("click", () => {
        appsScreen.style.display = "none";
        document.getElementById("messages-screen").style.display = "block";
    });

    document.getElementById("contacts-app").addEventListener("click", () => {
        appsScreen.style.display = "none";
        document.getElementById("contacts-screen").style.display = "block";
    });

    document.getElementById("settings-app").addEventListener("click", () => {
        appsScreen.style.display = "none";
        document.getElementById("settings-screen").style.display = "block";
    });

    // Close app functionality
    const closeApps = document.querySelectorAll(".close-app");
    closeApps.forEach((close) => {
        close.addEventListener("click", function () {
            const appScreen = this.closest(".app-screen");
            appScreen.style.display = "none";
        });
    });

    // Calculator app functionality
    document.getElementById('calculator-app').addEventListener('click', () => {
        document.getElementById('calculator-screen').style.display = 'block';
    });

    let display = document.getElementById('calc-display');
    let currentInput = '';
    let operator = '';
    let firstOperand = null;

    document.querySelectorAll('.calc-button').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            if (value === 'C') {
                currentInput = '';
                display.innerText = '0';
            } else if (value === '=') {
                if (firstOperand !== null && operator) {
                    currentInput = eval(`${firstOperand} ${operator} ${currentInput}`);
                    display.innerText = currentInput;
                    firstOperand = null;
                    operator = '';
                }
            } else if (['+', '-', '*', '/'].includes(value)) {
                if (currentInput) {
                    firstOperand = currentInput;
                    operator = value;
                    currentInput = '';
                }
            } else {
                currentInput += value;
                display.innerText = currentInput;
            }
        });
    });

    // Chrome app functionality
    const chromeApp = document.getElementById("chrome-app");
    const chromeScreen = document.getElementById("chrome-screen");
    chromeApp.addEventListener("click", function () {
        appsScreen.style.display = "none";
        chromeScreen.style.display = "block";
    });

    chromeScreen.querySelector(".close-app").addEventListener("click", function () {
        chromeScreen.style.display = "none";
    });

    chromeScreen.querySelector("#go-button").addEventListener("click", function () {
        const urlInput = document.getElementById("url-input").value;
        const webContent = document.getElementById("web-content");
        if (urlInput) {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(urlInput)}`;
            webContent.innerHTML = `<iframe src="${searchUrl}" width="100%" height="600px" style="border:none;"></iframe>`;
        } else {
            webContent.innerHTML = "<p>Please enter a search query.</p>";
        }
    });

    // Message functionality
    const messageDisplay = document.getElementById("message-display");
    const messageInput = document.getElementById("new-message");
    document.getElementById("send-button").addEventListener("click", () => {
        const messageText = messageInput.value.trim();
        if (messageText) {
            const messageElement = document.createElement("div");
            messageElement.textContent = messageText;
            messageDisplay.appendChild(messageElement);
            messageInput.value = ""; // Clear input field
            if (messageDisplay.childElementCount === 1) {
                messageDisplay.innerHTML = ""; // Clear default message
            }
        }
    });

    // Call the battery status and weather functions
    updateBatteryStatus();
    fetchWeather();
});
