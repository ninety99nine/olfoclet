<template>

    <div>
        <vue-highcharts
            type="chart"
            :options="chartOptions"
            :redrawOnUpdate="true"
            :oneToOneUpdate="false"
            :animateOnUpdate="true"
            @rendered="onRender"/>

    </div>

</template>
<script>
    import VueHighcharts from 'vue3-highcharts';

    export default {
        props: ['report', 'showComparisons'],
        components: { VueHighcharts },
        data() {
            return {

            }
        },
        computed: {
            chartOptions() {

                var series = [
                    {
                        name: this.report.series_name,
                        data: this.report.series_data['x-axis'],
                        color: this.report.hasOwnProperty('series_color') ? this.report.series_color : '#3f83f8',
                    }
                ];

                if( this.showComparisons && this.report.hasOwnProperty('comparison_series_data')) {

                    series.unshift({
                        name: this.report.comparison_series_name,
                        data: this.report.comparison_series_data['x-axis'],
                        color: this.report.hasOwnProperty('comparison_series_color') ? this.report.comparison_series_color : '#9ca3af',
                    });

                }

                const title = this.report.hasOwnProperty('title') ? this.report.title : '';
                const subtitle = this.report.hasOwnProperty('subtitle') ? this.report.subtitle : '';

                return {
                    chart: {
                        type: this.report.chart
                    },
                    title: {
                        text: title,
                        style: {
                            color: '#3f83f8',
                            fontSize: '1rem',
                            //  fontWeight: 'bold',
                        }
                    },
                    subtitle: {
                        text: subtitle,
                        style: {
                            color: '#6b7280'
                        }
                    },
                    series: series,
                    xAxis: {
                        categories: this.report.series_data['y-axis']
                    },
                    yAxis: {
                        title: {
                            text: 'Total'
                        },
                        allowDecimals: false,
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                radius: 2
                            }
                        }
                    },
                }
            }
        },
        methods: {
            onRender() {
                console.log('Chart rendered');
            }
        },
    };
</script>
