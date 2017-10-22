import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './main.routes';

export class MainController {

  awesomeThings = [];
  courses = {};
  reviewCount = 0;
  selectedCourseName = null; //course name from the select
  displayCourse = null; //course to display

  //just hardcode this, rather than wait on server to generate it
  courseNames = [];
   //courseNames = courseNames.sort();

  difficultyLabels = ["1 - Easy A", "2 - Mostly easy", "3 - Kinda hard", "4 - Very challenging", "5 - Prepare to be wrecked"];
  difficultyData = []; //array of 5 elements

  timeSpentLabels = ["0-5 hours", "6-12 hours", "13-18 hours", "18+ hours"];
  timeSpentData = []; //array of 4 elements

  //light to dark orange tones
  chartColors = [ '#fedbcd', '#fdb89b', '#fa7138', '#dc4405', '#641f02'];
  chartOptions = {
    cutoutPercentage: 40,
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        fontSize: 14,
        boxWidth: 20
      }
    }
  };

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/api/things')
      .then(response => {
        console.log("response should be json data ", response);
        this.courses = response.data.courseData.courses;
        this.reviewCount = response.data.courseData.reviewCount;
        this.courseNames = response.data.courseData.courseNames.sort();
      });
  }


  /* Call this method when the user picks a specific course out of the select dropdown.
     Update the user reviews and the two donut charts with specific course data. */
  displayThisCourse() {
    let courseKey = this.selectedCourseName.substring(0,6).split(' ').join('');
    this.displayCourse = this.courses[courseKey];
    this.difficultyData = this.displayCourse.difficulty;
    this.timeSpentData = this.displayCourse.timeSpent;

    /* build the difficulty donut chart and legend */
    const difficultyChartData = {
      labels: this.difficultyLabels,
      datasets: [{
        data: this.difficultyData,
        backgroundColor: this.chartColors
      }]
    };

    const ctxDifficulty = document.getElementById("donut-difficulty").getContext("2d");
    const difficultyChart = new Chart(ctxDifficulty, {
      type: 'doughnut',
      data: difficultyChartData,
      options: {
        legendCallback: (difficultyChart) => {
          console.log("difficulty: using the thing that generates the legend");
          var text = [];
          text.push('<ul class="donutLegend">');
          console.log(difficultyChart);
          for (let i = 0; i < this.difficultyData.length; i++) {
            console.log(this.difficultyData); // see what's inside the obj.
            text.push('<li>');
            text.push('<span style="background-color:' + this.chartColors[i] + ';" class="legendLabelBox"></span><span class="legendLabelText">' + difficultyChart.data.labels[i] + '</span>');
            text.push('</li>');
          }
          text.push('</ul>');
          return text.join("");
        }
      }
    });

    /* build the time spent donut chart and legend */
    const timeSpentChartData = {
      labels: this.timeSpentLabels,
      datasets: [{
        data: this.timeSpentData,
        backgroundColor: this.chartColors
      }]
      // These labels appear in the legend and in the tooltips when hovering different arcs
    };

    const ctxTimeSpent = document.getElementById("donut-timeSpent").getContext("2d");
      const timeSpentChart = new Chart(ctxTimeSpent, {
        type: 'doughnut',
        data: timeSpentChartData,
        options: {
          legendCallback: (timeSpentChart) => {
            console.log("time spent: using the thing that generates the legend");
            var text = [];
            text.push('<ul class="donutLegend">');
            console.log(timeSpentChart);
            for (let i = 0; i < this.timeSpentData.length; i++) {
              console.log(this.timeSpentData); // see what's inside the obj.
              text.push('<li>');
              text.push('<span style="background-color:' + this.chartColors[i] + ';" class="legendLabelBox"></span><span class="legendLabelText">' + timeSpentChart.data.labels[i] + '</span>');
              text.push('</li>');
            }
            text.push('</ul>');
            return text.join("");
          }
        }
      });

    document.getElementById('difficulty-chart-legend').innerHTML = difficultyChart.generateLegend();
    document.getElementById('timeSpent-chart-legend').innerHTML = timeSpentChart.generateLegend();
  }

}

export default angular.module('osuCsClassExplorerApp.main', [ngRoute])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
