<template>
    <!-- Root element of PhotoSwipe. Must have class pswp. -->
    <div class="pswp" tabindex="-1" >

        <!-- Background of PhotoSwipe. 
            It's a separate element as animating opacity is faster than rgba(). -->
        <div class="pswp__bg"></div>

        <!-- Slides wrapper with overflow:hidden. -->
       
                <div class="pswp__scroll-wrap"> 
                            <!-- Container that holds slides. 
                                PhotoSwipe keeps only 3 of them in the DOM to save memory.
                                Don't modify these 3 pswp__item elements, data is added later on. -->
                            
                            <div class="pswp__container">
                                <div class="pswp__item"></div>
                                <div class="pswp__item"></div>
                                <div class="pswp__item"></div>
                            </div>
                        
                            
                           

                            <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
                            <div class="pswp__ui pswp__ui">

                                <div class="pswp__top-bar">

                                    <!--  Controls are self-explanatory. Order can be changed. -->

                                    <div class="pswp__counter"></div>

                                    <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

                                    <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

                                    <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

                                    <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
                                    <!-- element will get class pswp__preloader--active when preloader is running -->
                                    <div class="pswp__preloader">
                                        <div class="pswp__preloader__icn">
                                        <div class="pswp__preloader__cut">
                                            <div class="pswp__preloader__donut"></div>
                                        </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                                    <div class="pswp__share-tooltip"></div> 
                                </div>

                                <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
                                </button>

                                <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
                                </button>

                                <div class="pswp__caption">
                                    <div class="pswp__caption__center"></div>
                                </div>

                            </div>

            </div>   

    </div>  
</template>

<script>
    import PhotoSwipe from 'photoswipe/dist/photoswipe';
    import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
export default {
    data(){
        return{
            images_project:[],
            cliente_proyecto: '', 
        }
    },
    mounted(){

    },
    methods:{
        openPhotoSwipe() {
            let pswpElement = document.querySelectorAll('.pswp')[0]
            // define options (if needed)
            let options = {
                    // history & focus options are disabled on CodePen        
                closeEl: true,
                captionEl: true,
                fullscreenEl: true,
                zoomEl: true,
                shareEl: true,
                counterEl: true,
                arrowEl: true,
                preloaderEl: true,
                
                history: false,
                focus: false,
                showAnimationDuration: 0,
                hideAnimationDuration: 0,
            };
            let gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, this.images_project, options);
            console.log(gallery)
            gallery.init();
        },
        openGallery( imgs ) { 
            console.log('in opengallery')
            this.images_project = imgs;
            this.openPhotoSwipe();
        }
    }
}
</script>

<style>

</style>