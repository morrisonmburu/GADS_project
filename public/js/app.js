if ("serviceWorker" in navigator) {
	window.addEventListener("load", function() {
	  navigator.serviceWorker
		.register("/js/sw.js")
		.then(res => console.log("service worker registered"))
		.catch(err => console.log("service worker not registered", err))
	})
}

const array1 = []

document.getElementById("searchForm").onsubmit = async (e) => {
	e.preventDefault()
	const cityName = document.getElementById("searchCity").value
	const error = document.getElementById("error")
	
	const data = await fetchWeatherData(cityName)

	if (data.cod == 404) {
		error.innerHTML = "Please search for a valid city 😩"
		document.getElementById("searchCity").value = ""
	} else {
		const { clouds, coord, id, main, sys, weather, wind, name } = data
		array1.push(id)

		const resValidate = validateData(array1, id)

		if (resValidate) {
			const error2 = document.getElementById("error2")
			error2.innerHTML = "The city you searched for is arleady there please search for another city 😩"
			document.getElementById("searchCity").value = ""
		} else {

			const date = new Date()
			const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
			const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
			const dayWeek = days[date.getDay()]
			const dateNumber = date.getDate()
			const monthName = Months[date.getMonth()+1]

			const li = document.createElement("div");
			li.classList.add("col-md-3", "spaceDivs");

			const markdown = `
					<div class="forecast-container container-fluid">
						<div class="today forecast">
							<div class="forecast-header">
								<div class="day">${dayWeek}</div>
								<div class="date">${dateNumber} ${monthName}</div>
							</div> <!-- .forecast-header -->
							<div class="forecast-content">
								<div class="location">
									${name}
									<div class="badge badge-pill badge-warning">${sys.country}</div>
								</div>
								<div class="degree">
									<div class="num">${parseFloat(main.temp).toFixed(2)}<sup>o</sup>C</div>
									<div class="forecast-icon">
										<img src="http://openweathermap.org/img/w/${weather[0].icon}.png" alt="" width=90>
									</div>	
								</div>
								<span><img src="images/icon-wind.png" alt="">${wind.speed}km/h</span>
								<span><img src="images/icon-compass.png" alt="">${wind.deg}</span>
							</div>
						</div>	
					</div>`

			li.innerHTML = markdown
			const list = document.getElementById("weatherData")
			list.appendChild(li)

			const error2 = document.getElementById("error2")
			error2.innerHTML = ""
		}

		document.getElementById("searchCity").value = ""
		error.innerHTML = ""
	}
}

async function fetchWeatherData (cityName) {
	const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=828359c963ff03798f7780135cc738ff`
	const response = await fetch(url);
	  return response.json();
}

function validateData (array1, id) {

	const uniqueValue = array1
		.map((id) => {
			return {
				count: 1,
				id: id
			}
		})
		.reduce((a, b) => {
			a[b.id] = (a[b.id] || 0) + b.count
			return a
		}, {})

	const duplicates = Object.keys(uniqueValue).filter((a) => uniqueValue[a] > 1)

	for (let i = 0; i < duplicates.length; i++) {
		if (duplicates[i] == id) {
			return true
		} else {
			return false
		}
	}
}