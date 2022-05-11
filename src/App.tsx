import './App.css';
import ontoTransactions from './data/onto-transactions.json';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

function App() {

  //group data by date and count
  var occurences = ontoTransactions.reduce((r: any, row: any) => {
    if (row.transactionType === 'success') {
      r[row.date] = ++r[row.date] || 1;
    }
    else {
      r[row.date] = --r[row.date] || -1;
    }
    return r;
  }, {});

  var result = Object.keys(occurences).map(function (key) {
    return { date: key, value: occurences[key] };
  });

  //3- get start and end date of the heatmap 
  const datesRange = result.map(d => Number(new Date(d.date)));
  const startDate = new Date(Math.min.apply(null, datesRange));
  const endDate = new Date(Math.max.apply(null, datesRange));

  // get max transactions value and min transactions value
  const valuesRange: number[] = result.map(r => r.value);
  const minValue: number = Math.min(...valuesRange);
  const maxValue: number = Math.max(...valuesRange);

  const getScaleCategory = (value: number): number => {
    if (value === 0) return 0;

    const rangeLimit: number = value > 0 ? maxValue : minValue;
    const percentage: number = (value / rangeLimit) * 100;

    let scale = 0;

    if (percentage > 0 && percentage <= 25)
      scale = 1;
    else if (percentage > 25 && percentage <= 50)
      scale = 2;
    else if (percentage > 50 && percentage <= 75)
      scale = 3;
    else if (percentage > 75 && percentage <= 100)
      scale = 4;

    return value > 0 ? scale : scale * -1;
  }

  const heatMapData = result.map(r => {
    return {
      ...r,
      scale: getScaleCategory(r.value)
    }
  });

  return (
    <div className="App">

      <header className="App-header">
        Financial transaction heatmap
      </header>

      <div className={"heat-map-container"}>
        <CalendarHeatmap
          startDate={new Date(startDate)}
          endDate={new Date(endDate)}
          showWeekdayLabels={true}
          values={heatMapData}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty';
            }
            return `color-scale-${value.scale}`;
          }}
        />
      </div>

    </div>
  );
}

export default App;
