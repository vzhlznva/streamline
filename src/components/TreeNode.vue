<script setup lang="ts">
import { useStore } from 'vuex'
import type { BaseNode, NodeLevel, RootCat } from '@/types/tree'
import { computed, ref } from 'vue';

interface Props {
  node: BaseNode | NodeLevel | RootCat
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  level: 0
})

const store = useStore()
const clickTimeout = ref<number | null>(null)
const clickedOnce = ref<boolean>(false)

const hasChildren = computed<boolean>(() => {
  const nodeWithChildren = props.node as NodeLevel | RootCat;
  if (nodeWithChildren.cat === undefined) return false;
  return Array.isArray(nodeWithChildren.cat) ? nodeWithChildren.cat.length > 0 : true;
})

const hasLeaves = computed<boolean>(() => {
  const nodeWithLeaves = props.node as NodeLevel;
  return Array.isArray(nodeWithLeaves.leaf) && nodeWithLeaves.leaf.length > 0;
})

const isExpanded = computed(() => {
  return store.getters.isNodeExpanded(props.node._nodeId)
})

const children = computed(() => {
  const nodeWithCat = props.node as NodeLevel | RootCat
  if (!nodeWithCat.cat) return []
  return Array.isArray(nodeWithCat.cat) ? nodeWithCat.cat : [nodeWithCat.cat]
})

const leaves = computed(() => {
  const nodeWithLeaf = props.node as NodeLevel
  return nodeWithLeaf.leaf || []
})

const handleClick = (event: Event) => {
  if (clickedOnce.value) return;

  clickedOnce.value = true

  clickTimeout.value = window.setTimeout(() => {
    console.log('single click')
    event.stopPropagation();
    store.dispatch('selectNode', props.node._nodeId);
    store.dispatch('addToSelectedList', props.node);
    clickedOnce.value = false
    clickTimeout.value = null;
  }, 250)
}

const handleDoubleClick = (event: Event) => {
  if (clickTimeout.value !== null) {
    clearTimeout(clickTimeout.value);
    clickTimeout.value = null;
  }
  clickedOnce.value = false;
  console.log('double click')
  event.stopPropagation();
  if (hasChildren.value || hasLeaves.value) store.dispatch('toggleExpanded', props.node._nodeId)
}

</script>

<template>
  <div class="tree-node" :class="{ 'tree-node__root': level === 0 }">
    <div class="tree-node__item" @click="handleClick" @dblclick="handleDoubleClick">

      <div class="tree-node__arrow" :class="{
        'tree-node__arrow-hidden': !hasChildren && !hasLeaves
      }">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M16.5303 8.96967C16.8232 9.26256 16.8232 9.73744 16.5303 10.0303L12.5303 14.0303C12.2374 14.3232 11.7626 14.3232 11.4697 14.0303L7.46967 10.0303C7.17678 9.73744 7.17678 9.26256 7.46967 8.96967C7.76256 8.67678 8.23744 8.67678 8.53033 8.96967L12 12.4393L15.4697 8.96967C15.7626 8.67678 16.2374 8.67678 16.5303 8.96967Z"
              fill="#000000"></path>
          </g>
        </svg>
      </div>
      <span class="tree-node__name"
        :class="{ 'single': !hasChildren && !hasLeaves, 'selected': store.getters.isNodeSelected(node._nodeId) }">{{
          node._name }}</span>
    </div>
    <div v-if="isExpanded" class="tree-node__children">
      <TreeNode v-for="child in children" :key="child._nodeId" :node="child" :level="level + 1" />
      <TreeNode v-for="leaf in leaves" :key="leaf._nodeId" :node="leaf" :level="level + 1" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tree-node {
  position: relative;
  margin-left: 20px;
  padding-left: 5px;
  border-left: 1px solid lightgray;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &__root {
    padding-left: 0;
    margin-left: 0;
    border: none;
  }

  &__item {
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }

  &__name {
    &.single {
      color: var(--accent);
    }

    &.selected {
      background-color: #da05be61;
    }
  }

  &__arrow {
    width: 20px;
    height: 20px;

    &-hidden {
      opacity: 0;
    }
  }
}
</style>