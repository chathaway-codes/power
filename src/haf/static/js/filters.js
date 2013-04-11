angular.module('powrGraphFilters', []).
    filter('graph_type', function() {
        return function(input) {
            var GRAPH_TYPE_CHOICES = {
                'LINE': 'Line Graph',
                'BAR': 'Bar Graph',
                'PIE': 'Pie Chart',
                'STAC': 'Stacked Area',
            };
            return GRAPH_TYPE_CHOICES[input];
        }
});