import { Component, OnInit } from '@angular/core';
import * as PhotoSwipe from 'photoswipe/dist/photoswipe';
import * as PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html'
})
export class ImageGalleryComponent {
  public images_project: any = [];
  public cliente_proyecto: string = ''; 
  constructor() {}

  openPhotoSwipe = function() {
    let pswpElement = document.querySelectorAll('.pswp')[0]
    
    // define options (if needed)
    let options = {
             // history & focus options are disabled on CodePen        
        history: false,
        focus: false,

        showAnimationDuration: 0,
        hideAnimationDuration: 0
        
    };
    let gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, this.images_project, options);
    gallery.init();
  };

  public openGallery( imgs )
  { 
  	this.images_project = imgs;
    this.openPhotoSwipe();
  }

}
