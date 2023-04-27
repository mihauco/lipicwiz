<template>
  <button
    class="button"
    :class="{'button--secondary': secondary}"
    @click="clickHandler"
  >
    <slot/>
  </button>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, withDefaults } from 'vue';

withDefaults(
  defineProps<{secondary?: boolean}>(),
  {secondary: false}
);

const emit = defineEmits(['click']);

const clickHandler = (event: MouseEvent) => emit('click', event);
</script>

<style lang="scss">
.button {
  display: inline-block;
  font-family: 'Lato', 'Arial', sans-serif;
  outline: 0;
  border: 1px solid #7B9EA8;
  cursor: pointer;
  font-weight: 600;
  border-radius: 4px;
  font-size: 16px;
  height: 35px;
  background-color: #7B9EA8;
  color: white;
  padding: 0 20px;

  &:hover {
    background-color: #618994;
    border: 1px solid #618994;
  }

  &--secondary {
    color: #000;
    background-color: transparent;
    border: 1px solid #BFBFBF;

    &:hover {
      background-color: #BFBFBF;
      border: 1px solid #BFBFBF;
    }
  }
}
</style>