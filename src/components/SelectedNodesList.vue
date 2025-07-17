<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const selectedList = computed(() => store.state.selectedList)

const handleRemoveItem = (id: string) => {
  store.dispatch('removeFromSelectedList', id)
}
</script>

<template>
  <div class="selected-nodes-list">
    <h3 class="selected-nodes-list__title">
      Selected Nodes List
    </h3>
    <div class="p selected-nodes-list__empty" v-if="selectedList.length === 0">
      Selected Nodes List is empty
    </div>
    <div class="selected-nodes-list__items" v-else>
      <div class="selected-item" v-for="item in selectedList" :key="item._nodeId">
        <span class="selected-item__name">
          {{ item._name }}
        </span>
        <button class="selected-item__btn" @click="handleRemoveItem(item._nodeId)" title="Delete item"> × </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.selected-nodes-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
  min-width: 400px;
  width: 100%;

  &__items {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0 0 0 10px;


    .selected-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 8px;

      &__name {
        text-wrap: "normal";
      }

      &__btn {
        border: 1px solid red;
        border-radius: 4px;
        background-color: rgba($color: #ff0000, $alpha: 0.1);
        outline: none;
        color: red;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: rgba($color: #ff0000, $alpha: 0.25);
        }

      }
    }
  }
}
</style>