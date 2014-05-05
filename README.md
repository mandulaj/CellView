CellView
========
This is a simple HTML5 web app using `Canvas` and `Javascript` to enhance the user experience while hovering over 'dots' on a cell...

###Setup

1. Download [Bootstrap](https://github.com/twbs/bootstrap/releases/download/v3.1.1/bootstrap-3.1.1-dist.zip) and put it in the main folder
2. Put all the data into a folder `/data`. How you organize it is up to you. I recommend put the photos into a separate sub-folder
3. Edit the `config.js` according to your needs:
    ```javascript
    var CanvasConfig = {
        "offset": {x: 0, y: 0},         // This is for debugging (it is the offset of the dots in case the coordinates are off-setted )
        "cell_img_vir_height": 234.9,   // IMPORTANT!!  number of vertical virtual pixels in the image (the grid the dots are positioned on)
        "cell_img_vir_width": 295.5,    // IMPORTANT!!  number of horizontal virtual pixels in the image (the grid the dots are positioned on)
        
        "dot_size_on_canvas": 6,        // The size of the dot that gets highlighted 
        "dot_color_on_canvas": "red",   // Color of the dot
        "dot_offset_on_canvas": {       // This only affects the position where the dots are drawn (measured in real pixels)
            x: -1,                     
            y: -1
        },
        "rect_color_on_canvas": "green",// The color of the rectangle we draw to show the enlarged image
        
        // The following sets the way we read the image
        // Default setting would render to the following:
        // "data/w/w_00001.png" for image number 1 
        
        "data_path": "data/w/",         // Path to dot images
        "data_prefix" : "w_",           // Prefix of the images
        "data_sufix": ".png",           // Extension/suffix of the images (can be jpg/png anything)
        "data_num_of_0": 5,             // Number of numbers in the image
        
        // This is very similar for psf images: 
        
        "psf_path": "data/psf/",        // Path to psf image
        "psf_prefix" : "psf_",          // its prefix
        "psf_sufix": ".png",            // suffix
        "psf_num_of_0": 3,              // and number of numbers
    }
    ```
4. Fire up the index.html and enjoy the clicking :)


## Set up of data
The way we read the data is still experimental. We decided to load it as a JavaScript array of arrays. 
The data is in `data/coord.js` Essentially it is a JavaScript script that declares a global variable `Cell_data`. It holds and array of arrays. Each array in the array is one dot. The positions in the inner array are the values for the dot.
Here are the positions and their meaning:

1. index of the coordinate (and image)
2. vertical position
3. horizontal position
4. axial position (defocus)
5. brightness 
6. correlation coefficient (reliability)
7. evaluation index 
8. upper left corner - vertical
9. upper left corner - horizontal
10. lower right corner - vertical
11. lower right corner - horizontal
  