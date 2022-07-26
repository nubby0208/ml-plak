<template>
    <div>
        <vue-toastr ref="toastr"></vue-toastr>
        <pdf :src="newPdf" @num-page="page" style="display: block;" >
        </pdf>
    </div>
</template>

<script>
	import { HTTP } from '../../index'
    import pdf from 'vue-pdf'
    import VueToastr from "vue-toastr";



    export default {
        props:{
            
        },
        components:{
            pdf,
            VueToastr
        },
        data() {
            return{
                pdfSrc: '',
                page: 1,
                src: '',
                newPdf: ''
            }
        },
        mounted(){

        },
        methods: {
            async onFileSelected(project_name, download) {
                console.log('en el otro componente---->', project_name, download)
                //let res = new Blob();
                HTTP.get(`/api/${project_name}/download_pdf`, {
                responseType: 'blob',
                //search: // query string if have
                }).then( (res) => {
                    console.log('entró al res')
                    //res = res.data
                    let response = res.data
                    console.log(response)
                    console.log('res----', response)
                    //if (typeof (FileReader) !== 'undefined') {
                        let reader = new FileReader();
                        reader.readAsArrayBuffer(response);
                        reader.onload = (e) => {
                            this.pdfSrc = e.target.result;
                            console.log('pdfsrc---->',this.pdfSrc)
                        }

                    let resp = {
                        filename: project_name + '.pdf',
                        target: '_blank',
                        data: response
                    }

                    console.log('--->', resp)
                    return resp
                })
                .then((res) =>{
                    //}else
                    //this.toastr.success('¡Optimizacion Cargada!');    
                    if (download =='true' || download) {
                        console.log('start download:', res);
                        var url = window.URL.createObjectURL(res.data);
                        var a = document.createElement('a');
                        document.body.appendChild(a);
                        a.setAttribute('style', 'display: none');
                        a.href = url;
                        this.newPdf = url
                        a.target = res.target;
                        a.download = res.filename;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        a.remove(); // remove the element
                        this.$refs.toastr.s('¡PDF Optimizacion Descargado!');
                    } else {
                        console.log('else')
                        var url = window.URL.createObjectURL(res.data);
                        this.newPdf = url
                        var a = document.createElement('a');
                        document.body.appendChild(a);
                        a.setAttribute('style', 'display: none');
                        a.href = url;
                        a.target = res.target;
                        //a.download = res.filename;
                        a.click();
                        //window.URL.revokeObjectURL(url);
                        a.remove(); // remove the element
                    }
                }, error => {
                    console.log('download error:', JSON.stringify(error));
                }, () => {
                    console.log('Completed file download.')
                });
               
                // else {
                //     console.log('download error:', JSON.stringify(res.error));
                // }
                // console.log('Completed file download.')
            }
        }
    }
</script>

<style>

</style>