<template>
    <b-row
        v-if="piece.pieces && piece.pieces.length > 0"
        align-v="center"
        class="pb-2"
     >
        <b-col
            class="px-0"
            cols=""
        >
            <font-awesome-icon
                v-if="piece.visible"
                style="cursor: pointer"
                @click="isCollapsed = !isCollapsed"
                :icon="isCollapsed ? 'caret-right' : 'caret-down'"
            />
        </b-col>
        <b-col
            class="px-0 text-left"
            cols="7"
        >
            <p
                class="h6 mb-0"
            >
                {{ String(piece.name).replace('_', ' ') }}
            </p>
        </b-col>
        
        <b-col
            class="px-0"
            cols="3"
        >
            <font-awesome-icon
                style="cursor: pointer"
                @click="$store.commit('togglePieceVisibility', {
                        visible: !piece.visible,
                        moduleName: module.moduleName,
                        pieceId: piece.id,
                        pieceName: piece.name,
                        isRoomEditor: module.isRoomEditor, 
                        elementId: piece.elementId
                    }
                )"
                size="lg"
                :icon="piece.visible ? 'eye' : 'eye-slash'"
            />
        </b-col>

        <b-container
            v-if="!isCollapsed && piece.visible"
            class="py-1"
        >
            <b-row
                v-for="(subPiece, index) of piece.pieces"
                :key="index"
            >
                <b-col
                    class="px-0"
                    cols="2"
                >
                </b-col>
                <b-col
                    class="px-0 text-left"
                    cols="7"
                >
                    {{ subPiece.name }}
                    - <i style="color: red">
                        {{ subPiece.elementId ? piece.elementId : 'Unset' }}    
                    </i>
                </b-col>
                <b-col
                    class="px-0"
                    cols="3"
                >
                <font-awesome-icon
                    
                    @click="$store.commit('togglePieceVisibility', {
                            visible: !subPiece.visible,
                            moduleName: module.moduleName,
                            pieceId: subPiece.id,
                            pieceName: subPiece.name,
                            isRoomEditor: module.isRoomEditor, 
                            elementId: subPiece.elementId
                        }
                    )"
                    style="cursor: pointer"
                    :icon="subPiece.visible ? 'eye' : 'eye-slash'"
                />
                </b-col>
            </b-row>
        </b-container>
    </b-row>
    <b-row
        v-else
    >
        <b-col
            class="px-0"
            cols="2"
        >
        </b-col>
        <b-col
            class="px-0 text-left"
            cols="7"
        >
            {{ piece.name }}
            - <i style="color: red">
                {{ piece.elementId ? piece.elementId : 'Unset' }}    
            </i>
        </b-col>
        <b-col
            class="px-0"
            cols="3"
        >
        <font-awesome-icon
            
            @click="$store.commit('togglePieceVisibility', {
                    visible: !piece.visible,
                    moduleName: module.moduleName,
                    pieceId: piece.id,
                    pieceName: piece.name,
                    isRoomEditor: module.isRoomEditor, 
                    elementId: piece.elementId
                }
            )"
            style="cursor: pointer"
            :icon="piece.visible ? 'eye' : 'eye-slash'"
        />
        </b-col>
    </b-row>
</template>
<script>
export default {
    props: {
        piece: {
            type: Object,
            default: null,
        },
        module: {
            type: Object,
            default: null,
        },
    },
    data: () => {
        return {
            isCollapsed: true,
        }
    }
}
</script>