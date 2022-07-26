<template>
    <b-row>
        <b-col
            class="px-0"
            cols="2"
        >
        </b-col>
        <b-col
            class="px-0 text-left"
            cols="7"
        >
            {{tipo}} {{ count+1 }}
        </b-col>
        <b-col
            class="px-0"
            cols="3"
        >
        <font-awesome-icon
            @click="$emit('setShowCad3d', count)"
            style="cursor: pointer"
            :icon="showVisible ? 'eye' : 'eye-slash'"
        />
        </b-col>
    </b-row>
</template>
<script>
export default {
    props: {
        geometria: {
            type: Object,
            default: null,
        },
        count: {
            type: Number,
            default: null,
        },
        tipo: {
            type: String,
            default: null,
        },
    },
    computed:{
        showVisible(){
            if(this.geometria.show3d === false){
                return false;
            }else{
                return true;
            }
        }
    },
    data: () => {
        return {
            isCollapsed: true,
        }
    }
}
</script>