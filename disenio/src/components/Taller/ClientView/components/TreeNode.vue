<template>
  <div v-bind:class="[this.node.children.length == 0 ? 'org-tree-node is-leaf' : 'org-tree-node']" v-if="this.node">
    <div class="org-tree-node-label">
      <div class="org-tree-node-label-inner" style="width: auto;">
        <span>
<!--          <input type="checkbox">-->
          <strong>#{{this.node.key}}</strong> {{this.views[this.node.viewId].name}}
          <a title="Delete item" style="color: red; cursor: pointer;" @click="removeNode()" >x</a>
        </span>
<!--        <br>-->
<!--        <span>-->
<!--          <a href="#">toggle expand</a>-->
<!--        </span>-->
        <drop  @drop="inside" v-if="cantChaild">
          <span class="org-tree-node-btn org-tree-node-show-btn"></span>
          <span class="org-tree-node-btn" v-if="visible"></span>
          <template v-slot:drag-image="{data}">
            <span class="int-area org-tree-node-btn"></span>
          </template>
        </drop>

      </div>
    </div>
    <div class="org-tree-node-children">
      <tree-node v-for="child in this.node.children"
                 v-bind:node="child" v-bind:visible="visible"
                 :key="child.key" v-bind:views="views"></tree-node>
    </div>
  </div>
</template>

<script>
  import { Drop } from 'vue-easy-dnd'

  export default {
    name: 'TreeNode',
    components: {
      Drop
    },
    props: {
      node: {
        type: Object,
        default: undefined
      },
      views: {
        type: Object,
        default: {}
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      inside (e) {
        this.views[e.data.id] = e.data
        this.node.children.push({
          viewId: e.data.id,
          key: this.node.key + '.' + this.node.children.length,
          children: [],
          parent: this.node
        })
      },
      removeNode () {
        let parent = this.node.parent
        if (parent) {
          let index = parent.children.indexOf(this.node)
          parent.children.splice(index, 1)
        } else {
          this.$emit('emptied')
        }
      }
    },
    computed: {
      cantChaild () {
        // linkNumber
        if (this.views[this.node.viewId].fieldsValues.linkNumber) {
          return this.node.children.length < this.views[this.node.viewId].fieldsValues.linkNumber.value
        } else {
          return this.node.children.length < 1
        }
      }
    }
  }
</script>

<style scoped>
  .org-tree-node-btn.org-tree-node-show-btn{
    border-color: #f000;
    /*border-color: red;*/
    box-shadow: none;
    background: none;
    z-index: 10;
  }

  .org-tree-node-btn.org-tree-node-show-btn:before {
    border-top-color: #f000;
    /*border-left-color: red;*/

  }

  .org-tree-node-btn.org-tree-node-show-btn:after {
    border-left-color: #f000;
    /*border-left-color: red;*/
  }
</style>
