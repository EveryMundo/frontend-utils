
_jol(function () {
    var config = window._priceWidgetConfig;
    // Maps price_widget id to handler function.
    // The handler function takes the returned data from the API
    // and updates the price_widget.
    var handlers = [];
    var ids = [];

    function formatDay(day, fmt) {
        return new Date(day + 'T00:00:00').format(fmt);
    }

    function getOffersMarkup(items, lastSeenData) {
        var result = '';
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            result = result +
                '<div class="offer" tabindex="0" role="button"' +
                ' trfx-booking' +
                ' data-oac="' + item.origin_airport_code + '"' +
                ' data-dac="' + item.destination_airport_code + '"' +
                ' data-departure-date="' + item.departure_date_standard + '"' +
                ' data-travel-class="' + item.travel_class + '"' +
                ' data-price="' + item.full_price + '"';

            if (item.return_date) {
                result = result +
                    ' data-return-date="' + item.return_date_standard + '"';
            }

            result = result +
                ' data-title="' + item.origin_city_name + ' ' + config.prepro_destination_place + ' ' + item.destination_city_name + '"' +
                ' data-sub="' + config.dates_title + ': ' + item.departure_date_standard + (item.return_date ? ' - ' + item.return_date_standard : '') + '"' +
                ' data-promo-code="' + (item.promo_code || '') + '"' +
                ' data-site-edition="' + config.site_edition + '"' +
                ' data-currency-code="' + item.currency_code + '">' +
                '<div class="offer-description">' +
                '<div>' +
                '<div class="td offer-cell-origin">' + item.origin_city_name + '<abbr title="' + item.origin_city_name + '"> (' + item.origin_airport_code + ')</abbr></div>' +
                '<div class="td offer-cell-destination">' + item.destination_city_name + '<abbr title="' + item.destination_city_name + '"> (' + item.destination_airport_code + ')</abbr></div>' +
                '<div class="td offer-cell-trip-type">' + (item.return_date ? config.label_round_trip : config.label_one_way) + '</div>' +
                '<div class="td offer-cell-dates">' +
                '<div>' + config.label_departure_date + ' ' + item.departure_date_formated + '</div>' +
                '<div>' + (item.return_date ? config.label_return_date + ' ' + item.return_date_formated : "") + '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="offer-prices">' +
                '<div>' +
                '<div class="td offer-cell-price">' +
                '<div class="offer--from">' + config.prepro_starting_price + '</div>' +
                '<div class="offer--price--value">' + item.full_price + '*</div>' +
                '<div class="offer--last-seen">' + lastSeenData.labelLastSeen + ' ' + item.price_last_seen.value + ' ' + lastSeenData.labelLastSeenUnits[item.price_last_seen.unit] + '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '</div>';
        }
        return result;
    }
    // Iterate through all price_widget elements in the page, that is,
    // all elements with a data-price-widget="..." attribute.
    $('[data-price-widget]').each(function () {
        var id = $(this).data('price-widget');

        var lastSeenData = {
            enabled: $(this).data('last-seen'),
            labelLastSeen: $(this).data('label-last-seen'),
            labelLastSeenUnits: {
                minute: $(this).data('label-last-seen-minute'),
                minutes: $(this).data('label-last-seen-minutes'),
                hour: $(this).data('label-last-seen-hour'),
                hours: $(this).data('label-last-seen-hours'),
                day: $(this).data('label-last-seen-day'),
                days: $(this).data('label-last-seen-days')
            }
        }

        ids.push(id);
        // Define a handler function for each price_widget.
        // We use a closure so that each function has access to the widget's id and
        // corresponding DOM root element.
        (function (id, rootNode) {
            handlers[id] = function (data) {
                // Check for 'undefined' because it means there is no data for the price_widget
                // and it should be skipped altogether.
                if (typeof data != 'undefined') {
                    $('.tbody', rootNode).html(getOffersMarkup(data, lastSeenData));
                }
                $(rootNode).removeClass('async');
                var selector = '[data-price-widget="' + id + '"]';
                document.querySelectorAll(selector).forEach(function (element) {
                    element.classList.remove("async");

                });
            };
        })(id, this);
    });

    // We're done if there are no widgets in the page.
    if (!ids.length) {
        return;
    }

    // Request data for all price widgets at once.
    var endpoint = config.trfx_fixed_domain + '/trfx/api/data/' + config.site_edition + '/pricing_widgets.json?ids=' + ids.join(',');

    $.getJSON(endpoint, function (result) {
        // Call all widget handler functions.
        for (var id in handlers) {
            if (handlers.hasOwnProperty(id)) {
                handlers[id](result && result[id] || undefined);
            }
        }
    }).fail(function () {
        // Call all handler function with no data (undefined).

    });
});
