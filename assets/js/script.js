const parseDate = d3.timeParse("%Y-%m-%d");
// 2020-2-15
const mapChart = dc.geoChoroplethChart("#map");
d3.csv("assets/data/worldometer_coronavirus_daily_data.csv")
  .catch((err) => {
    throw err;
  })
  .then((data) => {
    data.forEach((d) => {
      d.cumulative_total_cases = +d.cumulative_total_cases;
      d.daily_new_cases = +d.daily_new_cases;
      d.active_cases = +d.active_cases;
      d.cumulative_total_deaths = +d.cumulative_total_deaths;
      d.daily_new_deaths = +d.daily_new_deaths;
      d.date = parseDate(d.date);
    });
    d3.json("assets/data/countries.geojson").then((worldMap) => {
      // console.log(worldMap)

      const cData = crossfilter(data);
      const all = cData.groupAll();

      const dateDim = cData.dimension(dc.pluck("date"));
      const countriesDim = cData.dimension(dc.pluck("country"));

      const casesByDayGroup = dateDim
        .group()
        .reduceSum(dc.pluck("cumulative_total_cases"));

      const casesByCountryGroup = countriesDim
        .group()
        .reduceSum(dc.pluck("cumulative_total_cases"));

      mapChart
        .width(990)
        .height(500)
        .dimension(countriesDim)
        .group(casesByCountryGroup)
        .projection(d3.geoMercator())
        .overlayGeoJson(worldMap.features, "country", function (d) {
        //   console.log(d.properties.name);
          return d.properties.ADMIN;
        });
      // .overlayGeoJson(worldMap, "Countries", function (d) {
      //   return d.properties["Country/Region"];
      // })
      // .projection(d3.geoMercatorRaw);

      dc.renderAll();
    });
  });
