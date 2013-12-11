# Gallery

A responsive gallery jquery plugin.

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/hatchddigital/hatchling.slide/master/dist/slide.min.js
[max]: https://raw.github.com/hatchddigital/hatchling.slide/master/src/slide.js

In your web page:


```html
<script src="libs/jquery/jquery.js"></script>
<script src="dist/gallery.min.js"></script>
<script src="dist/gallery.css"></script>
<script type="text/javascript">
    $(function () {
        $('.gallery').gallery();
    });
</script>
```

## Usage

To have this work on your site we require specific CSS and markup requirements
to get all the pieces in place. We don't want you to be forced to use our
setup so this is a guide, we just need to you to have the same classes
somewhere in your code.

### HTML

The markup requires that everything is wrapped within a parent element so
that the correct slides and controls for the specific tool can be found.

The gallery should be composed of a parent element, with a list and a series
of gallery items. 

The default markup the gallery accepts is:

```html
<div class="gallery">
    <ul class="gallery-items">
        <li class="gallery-item">
            <a class="gallery-image" href="#">
                <img data-highres-image="img/1.jpg" alt="..." src="img/1.min.jpg"/>
            </a>
        </li>
        ....
    </ul>
</div>
```

Notice the distinction between the gallery-item and gallery-image blocks; 
the latter a clickable target, while the former is the containing element,
and may contain non-clickable elements, for example twitter or facebook share
links.

The selectors used to control this can be specified when invoking the
gallery:

```html
$(function () {
  $('.gallery').gallery({
    grid_selector: '.gallery-items',
    grid_item_selector: '.gallery-item',
    grid_image_selector: '.gallery-image'
  });
});
```

### Special classes

The classes 'state-zoom', 'state-inactive' and 'image-zoomed' are used to control 
the behaviour of the gallery via CSS; see the example dist/gallery.css.

### Javascript

Typically all that is required is to call `$('.gallery').gallery();` on the 
appropriate selector for the gallery parent.

## Development server

To run the local development server, use:

    npm install && bower install
    node server.js

Then hit http://localhost:3000/example/index.html

## Media

Amusing example images courtesy of Wikimedia Commons / CC-BY-SA-3.0

http://commons.wikimedia.org/wiki/File:Paisley_Abbey_New_Gargoyles.jpg

## Release History
- v0.0.0 Initial release.
