export default {
    init(url, ventana = false){
        if(ventana){
            this.myNewTab = window.open(url, "", `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
            width=0,height=0,left=-1000,top=-1000`);
        }else{
            this.myNewTab = window.open(url);
        }
    },
    pdfBlod(data){

        try {
         
            var base64str = data;
            var binary = atob(base64str.replace(/\s/g, ''));
            var len = binary.length;
            var buffer = new ArrayBuffer(len);
            var view = new Uint8Array(buffer);
            for (var i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i);
            }

            var file = new Blob([`<head></head> <body style="margin:0px;"> <embed src="data:application/pdf;base64,${data}" type="application/pdf" width="100%" height="100%" /></body>`], {type: 'text/html'});
            // var file = new Blob([view], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);
            this.myNewTab.location.href = fileURL;
        } catch (error) {
          console.log(error);
          return data;
        }      

    },
    error(){
        this.myNewTab.close();
    }
}