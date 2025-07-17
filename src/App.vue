<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore()

const rootCategories = computed(() => store.getters.rootCategories);

const expandAll = () => {
  store.dispatch('expandAllChildrenFromSelected')
}

const collapseAll = () => {
  store.dispatch('collapseAllChildrenFromSelected')
}

onMounted(() => {
  store.dispatch("initTreeState");
});

</script>

<template>
  <div class="app">
    <div class="app__body">
      <div class="app__body-tree">
        <div class="app__body-tree__head">
          <button class="btn-expand" @click="expandAll" type="button">Expand All</button>
          <button class="btn-collapse" @click="collapseAll" type="button">Collapse All</button>
        </div>
        <TreeNode v-for="rootCat in rootCategories" :key="rootCat._nodeId" :node="rootCat" :level="0" />
      </div>
      <div class="app__body-list">
        <SelectedNodesList />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app__body {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  &-tree__head {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    margin: 0 0 20px;
  }

  .btn-expand,
  .btn-collapse {
    border: none;
    outline: none;
    padding: 8px 12px;
    color: var(--accent);
    cursor: pointer;
  }
}
</style>
