$(document).ready(function() {

    var months = {
        'January': 0,
        'February': 0,
        'March': 0,
        'April': 0,
        'May': 0,
        'June': 0,
        'July': 0,
        'August': 0,
        'September': 0,
        'October': 0,
        'November': 0,
        'December': 0
    };

    var quarters = {
        Q1: 0,
        Q2: 0,
        Q3: 0,
        Q4: 0
    }

    var guadagni_a_testa = {};
    var guadagno_annuale = 0;

    $.ajax({
        'url': 'http://157.230.17.132:4018/sales',
        'method': 'GET',
        'error': function() {
            alert('error')
        },
        'success': function(data) {

            for (var i = 0; i < data.length; i++) {

                //LINE CHART
                mese_data_corrente = moment(data[i].date, 'DD/MM/YYYY').format('MMMM')
                // console.log(mese_data_corrente + moment(data[i].date, 'DD/MM/YYYY').format('Q'));
                // console.log(data[i].amount);

                months[mese_data_corrente] += data[i].amount;

                //PIE CHART
                //Crea oggetto {Salesman: guadagno}
                if (guadagni_a_testa.hasOwnProperty(data[i].salesman)) {
                    guadagni_a_testa[data[i].salesman] += data[i].amount;
                } else {
                    guadagni_a_testa[data[i].salesman] = data[i].amount
                }

                //Somma tutti i guadagni per il totale annuale
                guadagno_annuale += data[i].amount

                //Riempie l'oggetto 'quarters' con il guadagno di ciascun quadrimestre
                quarters['Q' + moment(data[i].date, 'DD/MM/YYYY').format('Q')] += data[i].amount;
            }

            //Trasforma in percentuale i valori del guadagno a testa
            for (var key in guadagni_a_testa) {
                guadagni_a_testa[key] = (guadagni_a_testa[key] * 100 / guadagno_annuale).toFixed(1)
            }

            lineChart(Object.keys(months), Object.values(months))
            pieChart(Object.keys(guadagni_a_testa), Object.values(guadagni_a_testa))
            barChart(Object.keys(quarters), Object.values(quarters))

        }
    })

    //Grafico 1
    var line_chart = document.getElementById('lineChart').getContext('2d');

    function lineChart(x, y) {
        var config = new Chart(line_chart, {
            type: 'line',
            data: {
                labels: x,
                datasets: [{
                    label: 'Guadagno azienda (€)',
                    data: y,
                    fill: true,
                    borderColor: 'rgb(250, 204, 0)',
                    backgroundColor: 'rgba(250, 204, 0,.15)',
                    lineTension: 0,
                }],
            },//Data
            options: {
                title: {
                    display: true,
                    text: 'Andamento annuale azienda',
                    position: 'left',
                    fontSize: 18,
                    padding: 50,
                    fontStyle: 'normal',
                }
            }
        }); //config
    }

    //Grafico 2
    var pie_chart = document.getElementById('pieChart').getContext('2d');

    function pieChart(x, y) {
        var config = new Chart(pie_chart, {
            type: 'pie',
            data: {
                labels: x,
                datasets: [{
                    data: y,
                    fill: true,
                    backgroundColor: ['#f4f6ff', '#f3c623', '#127681', '#10375c'],
                    hoverBackgroundColor: ['#f1f1fd'],
                    borderWidth: 0,
                }],
            },//Data
            options: {
                    legend: {
                        position: 'left',
                    },
                    title: {
                        display: true,
                        text: '% Guadagni per impiegato',
                        position: 'left',
                        fontSize: 18,
                        padding: 50,
                        fontStyle: 'normal',
                    }
            }
        }); //config
    }

    //Grafico 3
    var bar_chart = document.getElementById('barChart').getContext('2d');
    function barChart(x, y) {
        var config = new Chart(bar_chart, {
            type: 'bar',
            data: {
                labels: x,
                datasets: [{
                    data: y,
                    fill: true,
                    backgroundColor: ['rgba(255, 173, 173, .45)', 'rgba(255, 214, 165, .45)', 'rgba(253, 255, 182, .45)', 'rgba(202, 255, 191, .6)'],
                    borderColor: ['rgba(255, 173, 173, 1)', 'rgba(255, 214, 165, 1)', 'rgba(253, 255, 182, 1)', 'rgba(202, 255, 191, 1)'],
                    borderWidth: 2,

                }],
            },//Data
            options: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Guadagno per quadrimestre (€)',
                        position: 'left',
                        fontSize: 18,
                        padding: 50,
                        fontStyle: 'normal',
                    }
            }
        }); //config
    }

})//Ready
