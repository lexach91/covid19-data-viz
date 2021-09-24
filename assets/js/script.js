const parseDate = d3.timeParse("%m/%d/%Y")
d3.csv("assets/data/covid_19_data.csv")
    .catch((err) => {throw err})
    .then(data => {
        data.forEach(d => {
            d.Confirmed = +d.Confirmed;
            d.Recovered = +d.Recovered;
            d.Deaths = +d.Deaths;
            d.ObservationDate = parseDate(d.ObservationDate);
        })

        const cData = crossfilter(data);
        const all = cData.groupAll();
    })
