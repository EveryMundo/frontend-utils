
_jol(function () {
    var config = window._priceWidgetConfig;

    var ids = [];
    var current_widget = {};
    var swipers = [];
  
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
    
    function renderDealCard(item, classes){
        return 
        '<div class="' + classes + '"' + 'tabindex="0" role="button"' + getDealMetadata(item) + '/>' + 
            '<div class="offer-description">' +
                '<div>' +
                    '<div class="td offer-cell-origin">' + item.origin_city_name + '<abbr title="' + item.origin_city_name + '"> (' + item.origin_airport_code + ')</abbr></div>' +
                    '<div class="td offer-cell-destination">' + item.destination_city_name + '<abbr title="' + item.destination_city_name + '"> (' + item.destination_airport_code + ')</abbr></div>' +
                    '<div class="td offer-cell-dates">' +
                        '<div>' + config.labels.departure_date + ' ' + item.departure_date_formated + '</div>' +
                        '<div>' + (item.return_date ? config.labels.return_date + ' ' + item.return_date_formated : "") + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="offer-prices">' +
                renderPriceCell(item) +
            '</div>' +
            '<div class="cta-container">' +
                '<button class="">' + config.labels['cta_booking'] + '</button>' +
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
        '<div>' + config.labels.departure_date + ' ' + item.departure_date_formated + '</div>' +
        '<div>' + (item.return_date ? config.labels.return_date + ' ' + item.return_date_formated : "") + '</div>' +
        '</td><td>' +
            renderPriceCell(item) +
        '</td></tr>';

        return result(item)
    }

    function renderPriceCell(item){
        return '<div class="offer--from">' + config.labels.prep_starting_price + '</div>' +
        '<div class="offer--price--value' +  (isTable ? ' fs5' : ' fs3')  + '">' + item.full_price + '*</div>' +
        '<div class="offer--last-seen">' + config.labels.last_seen + ' ' + item.price_last_seen.value + ' ' + confid.labels['last_seen_' + item.price_last_seen.unit] + '</div>';
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
        ' data-title="' + item.origin_city_name + ' ' + config.labels.prep_destination_place + ' ' + item.destination_city_name + '"' +
        ' data-sub="' + config.dates_title + ': ' + item.departure_date_standard + (item.return_date ? ' - ' + item.return_date_standard : '') + '"' +
        ' data-promo-code="' + (item.promo_code || '') + '"' +
        ' data-site-edition="' + config.site_edition + '"' +
        ' data-currency-code="' + item.currency_code;
    }

    //todo
    $('.pw-view-more').on('click', function(){
        $(this).parent('.price-widget-deals').children('.pw-hide').addClass('show');
        $(this).text = pw_labels['pw-show-less'];
    });

    function renderWidgets(data, isRemote){
        for(var id in ids){
            //normalize data
            current_widget[id] = id;
            current_widget['metdata'] = isRemote ? data['metadata'][id] : getRemoteMeta(id);
            current_widget['deals'] = isRemote ? data[id] : pricing_widgets['pricing-widget-' + id]['deals'];
            current_widget['labels'] = config['labels'];
            //render
            var html = '';
            if(current_widget['metdata']['visualization_type'] == 'TABLE'){
                html = renderTable(current_widget['metdata'], current_widget['deals'], current_widget['labels']);
            }
            if(current_widget['metdata']['visualization_type'] == 'GRID'){
                html = renderGrid(current_widget['metdata'], current_widget['deals'], current_widget['labels']);
            }
            if(current_widget['metdata']['visualization_type'] == 'CAROUSEL'){
                html = renderCarousel(current_widget['metdata'], current_widget['deals'], current_widget['labels']);
            }

            var $widget = $('[data-price-widget="' + id + '"]');
            //attach html
            $widget.children('price-widget-deals').html(html);
            //initialize js-comp if needed
            if(current_widget['metdata']['visualization_type'] == 'CAROUSEL'){
                initSwiper(id);
            }
            //remove placeholder
            var selector = '[data-price-widget="' + id + '"]';
            document.querySelectorAll(selector).forEach(function (element) {
                element.classList.remove("async");
            });

        }
    }
    function initSwiper(id){
        swipers[id] = new Swiper(".swiper", {
            spaceBetween: 30,
    
            breakpoints: {
              420: {
                slidesPerView: 1,
                slidesPerGroup: 1
              },
              768: {
                slidesPerView: 2,
                slidesPerGroup: 2
              },
              980: {
                slidesPerView: 3,
                slidesPerGroup: 3
              },
              1200: {
                slidesPerView: 4,
                slidesPerGroup: 4
              }
            },
            pagination: {
              el: ".swiper-pagination",
              clickable: true
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev"
            }
          });            
    }

    function getRemoteMeta(id){
        const pw = pricing_widgets['pricing-widget-' + id];
        return {
            visualization_type: pw['fare_visualization_type'],
            module_type: pw['module_type'],
            include_images: pw['include_images']
        }
    }

    $('[data-price-widget]').each(function () {
        ids.push($(this).data('price-widget'));
    });

    var endpoint = config.trfx_fixed_domain + '/trfx/api/data/' + config.site_edition + '/pricing_widgets.json?ids=' + ids.join(',');

    $.getJSON(endpoint, function (result) {
        result && renderWidgets(result, true)
    }).fail(function () {
        renderWidgets(pricing_widgets, false)
    });
});
