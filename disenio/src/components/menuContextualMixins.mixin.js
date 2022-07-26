export default {
    data(){
        return {
            show:false,
            x:{
                top:"0px",
                left:"0px",
            },
            offset:{
                x:0,
                y:0,
            }
        }
    },
    methods:{
        showMenu(event){
            this.show = true;
            var maxLeft=(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth);
			var maxTop=(window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight);

            
            this.x.left=((event.pageX>maxLeft?maxLeft:event.pageX+3)+this.offset.x)+"px";
            // this.x.left=(event.pageX-60)+"px";
            this.x.top=((event.pageY>maxTop?maxTop:event.pageY)+this.offset.y)+"px";
            // this.x.top=(event.pageY-50)+"px";
        }
    },
    mounted(){
        document.addEventListener('click', ()=> {
            this.show = false;
        }, false);
    }
}