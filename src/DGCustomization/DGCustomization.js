// Sets default zoom position from current theme

L.Control.Zoom.prototype.options = {
    position: L.DG.configTheme.controls.zoom.position
};

// TODO: think about pull request to leaflet with zoom control button's titles as options

L.Control.Zoom.prototype.onAdd = function (map) {
    var zoomName = 'dg-zoom',
        container = L.DomUtil.create('div', zoomName);

    this._map = map;

    this._zoomInButton = this._createButton('+', 'Приблизить', zoomName + '__in', container, this._zoomIn, this);
    this._zoomOutButton = this._createButton('-', 'Отдалить', zoomName + '__out', container, this._zoomOut, this);

    map.on('zoomend zoomlevelschange', this._updateDisabled, this);

    return container;
};

// Adds 2GIS-related popup content wrapper and offset
(function () {
    var offsetX = L.DG.configTheme.balloonOptions.offset.x,
        offsetY = L.DG.configTheme.balloonOptions.offset.y,
        originalSetContent = L.Popup.prototype.setContent,
        graf = baron.noConflict();

    L.Popup.prototype.options.offset = L.point(offsetX, offsetY);

    L.Popup.prototype.setContent = function (content) {
        this._shouldInitBaronContainer = true;
        this._shouldInitBaronScroller = true;
        return originalSetContent.call(this, content);
    };

    L.Popup.prototype.setHeaderContent = function(content) {
        this._headerContent = content;
    };

    L.Popup.prototype.setFooterContent = function(content) {
        this._footerContent = content;
    };

    L.Popup.prototype._shouldInitHeaderFooter = function() {
        return !!(this._headerContent && this._footerContent);
    };

    L.Popup.prototype._initHeaderFooter = function() {
        this._content = '<div class="dg-popup-header">' + this._headerContent + '</div>' + this._content;
        this._content += '<div class="dg-popup-footer">' + this._footerContent + '</div>';
    };

    L.Popup.prototype.clearHeaderFooter = function() {
        this._footerContent = undefined;
        this._headerContent = undefined;
    };

    L.Popup.prototype._initBaronContainer = function () {
        this._content = '<div class="container">' + this._content + '</div>';
        this._shouldInitBaronContainer = false;
    };

    L.Popup.prototype._initBaronScroller = function () {
        this._content = '<div class="scroller"><div class="container">' + this._originalContent + '</div><div class="scroller__bar-wrapper"><div class="scroller__bar"></div></div></div>';
        this._shouldInitBaronScroller = false;
    };

    L.Popup.prototype._update = function () {
        var shouldInitBaron;

        if (!this._map) {
            return;
        }

        this._container.style.visibility = 'hidden';

        if (this._shouldInitBaronContainer) {
            this._originalContent =  this._content;
            this._initBaronContainer();
        }
        this._updateContent();
        this._updateLayout();
        this._updatePosition();

        shouldInitBaron = this._shouldInitBaron();

        if (shouldInitBaron) {
            if (this._shouldInitBaronScroller) {
                this._initBaronScroller();
                if (this._shouldInitHeaderFooter()) {
                    this._initHeaderFooter();
                }
                this._updateContent();
            }
            this._initBaron();
        } else if (this._shouldInitHeaderFooter()) {
            this._initHeaderFooter();
            this._updateContent();
        }

        this._container.style.visibility = '';
        this._adjustPan();
    };

    L.Popup.prototype._shouldInitBaron = function () {
        var popupHeight = this._contentNode.offsetHeight,
            maxHeight = this.options.maxHeight;

            return (maxHeight && maxHeight <= popupHeight);
    };

    L.Popup.prototype._initBaron = function () {
        var self = this;

        graf({
            scroller: '.scroller',
            bar: '.scroller__bar',
            $: function(selector, context) {
              return bonzo(qwery(selector, context));
            },
            event: function(elem, event, func, mode) {
              if (mode == 'trigger') {
                mode = 'fire';
                console.log(event);
              }
              bean[mode || 'on'](elem, event, func);
            }
        });
    };
}());

L.Map.include({
    openPopup: function (popup, latlng, options) { // (Popup) or (String || HTMLElement, LatLng[, Object])
        var content;

        this.closePopup();

        if (!(popup instanceof L.Popup)) {
            content = popup;
            popup = new L.Popup(options).setLatLng(latlng).setContent(content);
        }
        popup._isOpen = true;

        this._popup = popup;

        if (popup._source && popup._source._icon) {
            L.DomUtil.addClass(popup._source._icon, 'leaflet-marker-active');
        }

        return this.addLayer(popup);
    },

    closePopup: function (popup) {
        if (!popup || popup === this._popup) {
            popup = this._popup;
            this._popup = null;
        }
        if (popup) {
            if (popup._source && popup._source._icon) {
                L.DomUtil.removeClass(popup._source._icon, 'leaflet-marker-active');
            }
            this.removeLayer(popup);
            popup._isOpen = false;
        }
        return this;
    }
});

// Applies 2GIS divIcon to marker

L.Marker.prototype.options.icon = L.DG.divIcon();
