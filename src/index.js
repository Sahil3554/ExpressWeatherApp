const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const requests = require('requests');
const port = 8000;
const views_directory = path.join(__dirname,"../templates/views");
const public_directory = path.join(__dirname,"../public");
const partial_directory = path.join(__dirname,"../templates/partials");
// console.log(partial_directory);
app.set("view engine","hbs")
app.set("views",views_directory);
hbs.registerPartials(partial_directory);
app.use(express.static(public_directory));
app.use(express.urlencoded({
  extended: true
}));
const calcTemp = (temp) =>{
    temp = Math.floor(temp)-273;
    return temp;
}
app.get("/",(req,res) => {
    if((req.query.city == "") || (req.query.city == undefined)){
        res.render("select");
    }
    else{
        
        requests(`http://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&appid=6c23b81d5f5b9680f0cf087657363227`)
    .on('data', function (chunk) {
      const data = JSON.parse(chunk);
      // console.log(data.main.feels_like);
      // console.log(data.main.temp_min);
      // console.log(data.main.temp_max);
      // console.log(data.weather[0].main);
      // console.log(data.name);
      // console.log(data.sys.country);
      let cur_temp = calcTemp(data.main.feels_like);
      let temp_max = calcTemp(data.main.temp_max);
      let temp_min = calcTemp(data.main.temp_min);
      let icon = "";
      if((data.weather[0].main) == "Clouds"){
        icon ="fa fa-cloud";
      }
      else{
        icon = "fas fa-sun";
      }
      res.render('index',{
        temp: cur_temp,  
        city: data.name,
        min_temp: temp_min,        
        max_temp: temp_max,
        country: data.sys.country,
        status: data.weather[0].main,
        icons:icon
      });
    })
    .on('end', function (err) {
      if (err) return console.log('connection closed due to errors', err);
    
      console.log('end');
    });

    }
});
app.listen(port,()=>{
    console.log(`Server Listening at ${port}`);
});
