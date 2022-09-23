
_jol(function () {
    var config = window._priceWidgetConfig;
    var endpoint = config.trfx_fixed_domain + '/trfx/api/data/' + config.site_edition + '/pricing_widgets.json?ids=' + ids.join(',');
    
    // Maps price_widget id to handler function.
    // The handler function takes the returned data from the API
    // and updates the price_widget.
    var handlers = [];
    var ids = [];



    function renderTable(pw_meta, items, labels){
        var result = '<table><thead>';
        result += 
        '<th>' + (pw_meta['module_type'] == 'HOTEL') ? labels['hotel_name'] : labels['pw-flight'] + '</th>' +
        '<th>' +  (pw_meta['module_type'] == 'HOTEL') ? labels['pw-flight'] : labels['hotel_name'] + '</th>' +
        '<th>' + labels['pw-date'] + '</th>' +
        '<th>' + labels['pw-night-stays'] + '</th>' +
        '<th>' + labels['pw-price'] + '</th>';

        result += '</thead><tbody>';

        items.map((items, idx), function(item, idx){renderDealRow(item, getItemClasses(pw_meta, idx))});
        
        result += '</tbody></table>';
        result += '<div class="pw-viewmore-container"><button class="">' + pw_labels['pw-view-more'] +'</button></div>';
    }

    function renderGrid(pw_meta, items, labels){
        var result = 
            '<div class="pw-grid">';
                items.map((items, idx), function(item, idx){renderDealCard(item, getItemClasses(pw_meta, idx))});
                result += 
            '</div>';
                result += 
            '<div class="pw-viewmore-container"><button class="">' + pw_labels['pw-view-more'] +'</button></div>';
        return result;
    }

    function renderCarousel(pw_meta, items, labels){
        var result =
        '<div class="container-pag">' +
            '<div class="container-nav">' +
                '<div class="swiper-button-prev"></div>' +
                '<div class="swiper">' +
                    '<div class="swiper-wrapper">' +
                        items.map((items, idx), function(item, idx){renderDealCard(item, getItemClasses(pw_meta, idx))});
                        result +=
                    '</div>' +
                '</div>' +
                '<div class="swiper-button-next"></div>' +
            '</div>' +
            '<div class="swiper-pagination"></div>' +
        '</div>';
        return result;
    }
    
    function getItemClasses(pw_meta, item_index){
        var classes  = 'offer';
        classes += pw_meta['module_type'] == 'HOTEL' ? ' pw-card-hotel' : ' pw-card-route';
        if(pw_meta['viz_type'] !== 'TABLE' && item_index > 4){
            classes += ' pw-hidden-card';
        }
        if(pw_meta['viz_type'] !== 'GRID' && item_index > 8){
            classes += ' pw-hidden-card';
        }
        if(pw_meta['viz_type'] !== 'CAROUSEL'){
            classes += ' swiper-slide';
        }
        if(pw_meta['viz_type'] !== 'TABLE' && pw_meta['include_imgs']){
            classes += ' has-image';
        }
        return classes;
    }

    function getDealMetadata(item){
        return ' trfx-booking' +
        ' data-oac="' + item.origin_airport_code + '"' +
        ' data-dac="' + item.destination_airport_code + '"' +
        ' data-departure-date="' + item.departure_date_standard + '"' +
        ' data-travel-class="' + item.travel_class + '"' +
        ' data-price="' + item.full_price + '"' +
        ' data-return-date="' + item.return_date_standard + '"'
        ' data-title="' + item.origin_city_name + ' ' + config.prepro_destination_place + ' ' + item.destination_city_name + '"' +
        ' data-sub="' + config.dates_title + ': ' + item.departure_date_standard + (item.return_date ? ' - ' + item.return_date_standard : '') + '"' +
        ' data-promo-code="' + (item.promo_code || '') + '"' +
        ' data-site-edition="' + config.site_edition + '"' +
        ' data-currency-code="' + item.currency_code;
    }

    function renderDealCard(item, classes){
        return 
        '<div class="' + classes + '"' + 'tabindex="0" role="button"' + getDealMetadata(item) + '/>' + 
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
                    renderPriceCell(item) +
                '</div>' +
            '</div>' +
        '</div>';
    }

    function renderDealRow(item, classes){
        var result = '';

        result = result + 
        '<tr class="' + classes + '"' + getDealMetadata(item) + '><td>' + 
        '</td><td>' +
        //item['hotel_name']
        '</td><td>' +
        '<div class="td offer-cell-origin">' + item.origin_city_name + '<abbr title="' + item.origin_city_name + '"> (' + item.origin_airport_code + ')</abbr></div>' +
        '<div class="td offer-cell-destination">' + item.destination_city_name + '<abbr title="' + item.destination_city_name + '"> (' + item.destination_airport_code + ')</abbr></div>' +
        '</td><td>' +
        //item['departure']
        //item['return']
        '<div>' + config.label_departure_date + ' ' + item.departure_date_formated + '</div>' +
        '<div>' + (item.return_date ? config.label_return_date + ' ' + item.return_date_formated : "") + '</div>' +
        '</td><td>' +
            renderPriceCell(item) +
        '</td></tr>';

        return result(item)
    }

    function renderPriceCell(item){
        return '<div class="offer--from">' + config.prepro_starting_price + '</div>' +
        '<div class="offer--price--value' +  (isTable ? ' fs5' : ' fs3')  + '">' + item.full_price + '*</div>' +
        '<div class="offer--last-seen">' + lastSeenData.labelLastSeen + ' ' + item.price_last_seen.value + ' ' + lastSeenData.labelLastSeenUnits[item.price_last_seen.unit] + '</div>';
    }
    //todo
    $('.pw-view-more').on('click', function(){
        $(this).parent().children('.').addClass('');
        $(this).text = pw_labels['pw-show-less'];
    })

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
    

    $.getJSON(endpoint, function (result) {
        // delete BE data
        
        // Call all widget handler functions.
        for (var id in handlers) {
            if (handlers.hasOwnProperty(id)) {
                handlers[id](result && result[id] || undefined);
            }
        }
    }).fail(function () {
        //render BE data
        
        //delete BE data
    });
});
