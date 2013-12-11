/**
 * HATCHD DIGITAL GALLERY
 *
 * ...
 *
 * This code has been developed in house at HATCHD DIGITAL.
 * @see http://hatchd.com.au/
 *
 * FOR DEVELOPERS:
 *
 * The code in this file should always be well formatted and never be
 * used in production systems. Your site should always use disc/*-.min.js
 * which contains a packed and minified version of the script
 * prepended with all dependencies.
 *
 * REQUIRED FRAMEWORKS
 *
 * @required jquery (v1.8.0+)
 * -- (http://jquery.com)
 *
 * VALIDATION
 *
 * All code must validate with JSHint (http://www.jshint.com/) before
 * commiting this repo. NO debug code should remain in your final
 * versions. Ensure to remove every reference to console.log.
 *
 * STYLE
 *
 * All code should be within 79 characters WIDE to meet standard Hatchd
 * protocol. Reformat code cleanly to fit within this tool.
 *
 * CONTRIBUTORS
 *
 * @author Douglas Linder <douglas@hatchd.com.au>
 *
 */

/* global define */

(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    }
    else {
        // Browser globals
        window.Gallery = factory(window.jQuery);
    }

}(function ($) {
    'use strict';


    /**
     * Create a gallery object.
     * @param element The element to attach a gallery to.
     * @param options Any optional parameters for thie gallery configuration.
     * @returns {Gallery}
     * @constructor
     */
    var Gallery = function (element, options) {

        // Gallery configuration
        this.options = $.extend(options, {
            cache_size: 10,
            grid_selector: '.gallery-items',
            grid_item_selector: '.gallery-item',
            grid_image_selector: '.gallery-image',
            image_zoomed: 'image-zoomed',
            state_zoom: 'state-zoom',
            state_inactive: 'state-inactive'
        });

        // High resolution image cache.
        // Cache at most cache_size images here for quicker loading.
        this.cache_keys = [];
        this.cache = {};

        // Currently zoomed item
        this.current_zoom = null;

        // Bind gallery
        this._bind(element);

        return this;
    };

    /**
     * Attach callbacks to the given gallery root.
     * @param root The root element for this gallery.
     * @private
     */
    Gallery.prototype._bind = function (root) {

        // Attach picture zooming functionality
        var gallery = this;
        $(root).find(this.options.grid_image_selector).each(function (i, e) {
            gallery._pictureZoom(e);
        });

        // Support hash urls
        if (window.location.hash) {
            var picture_id = window.location.hash.match(/picture=(\d+)/);
            if ((picture_id !== null) && (picture_id.length === 2)) {
                picture_id = picture_id[1];
            }

            $('#picture' + picture_id + ' .image-zoom').click();
        }
    };

    /**
     * Zoom into pictures within a grid. The zoom button will enable set
     * some classes which will be used to enlarge the picture. All real
     * work will be done within the `state-zoom` on the picture's CSS and
     * `state-active` on the grid.
     *
     * @param  {element} target The element to apply the zoom handler to.
     */
    Gallery.prototype._pictureZoom = function (target) {
        var $grid = $(this.options.grid_selector);
        var gallery = this;
        var handler = function (e) {
            var $container = $(target).parents(
                gallery.options.grid_item_selector
            );
            var $im = $container.find('img');
            var hrsrc = $im.data('highres-image');
            e.preventDefault();

            // Remove any existing zoomed element
            $('.' + gallery.options.state_zoom).each(function (i, e) {
                var $e = $(e);
                $e.removeClass(gallery.options.state_zoom);
                $e.remove();
            });

            // If we're clicking on the currently zoomed element, stop now.
            if (gallery.current_zoom === hrsrc) {
                gallery.current_zoom = null;
                $grid.removeClass(gallery.options.state_inactive);
                return;
            }

            // Get the a popup node
            var $option = gallery._cachedPopup($container, hrsrc);
            $option.unbind('click');
            $option.on('click', handler);

            // Set the popup to be the high resolution image
            var $oim = $option.find('img');
            $oim.attr('src', hrsrc);
            $oim.addClass(gallery.options.image_zoomed);

            // Set positioning for modal box, relative to the grid
            var current_position = $container.offset().top;
            var grid_position = $grid.offset().left;
            $option.addClass(gallery.options.state_zoom).css({
                top: current_position,
                left: grid_position,
                width: $grid.width() - 2
            });

            // Add the box to the DOM
            $grid.append($option);
            $grid.addClass(gallery.options.state_inactive);
            gallery.current_zoom = hrsrc;
        };
        return $(target).on('click', handler);
    };

    /**
     * Fetch a cached high resolution image or the given node.
     * If no cached instance exists, return a new one.
     * @param element $parent A parent element to copy.
     */
    Gallery.prototype._cachedPopup = function ($parent, key) {
        if (!(key in this.cache)) {
            this.cache[key] = $parent.clone(true, true);
            this.cache_keys.push(key);

            // Expire old cache entries
            if (this.cache.length > this.options.cache_size) {
                var old = this.cache.shift();
                delete this.cache[old];
            }
        }
        return this.cache[key];
    };

    /**
     * jQuery plugin function to initialize any Gallery interface provided.
     *
     * @param {object} options User options for new gallery interface
     * @return {selector}
     */
    $.fn.gallery = function (options) {

        options = options || {};

        return this.each(function () {
            var gallery = $(this).data('gallery');
            if (!gallery) {
                gallery = new Gallery(this, options);
                $(this).data('gallery', gallery);
            }
        });
    };

    return Gallery;
}));
