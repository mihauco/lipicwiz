<template>
  <div class="zoom">
    <label class="zoom__label">{{ label }}:</label>
    <input
      class="zoom__input"
      type="range"
      min="0"
      max="100"
      v-model="zoom"
      @input="inputHandler"
    >
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: number,
  label: string
}>()

const emit = defineEmits(['update:modelValue'])

const zoom = ref(props.modelValue || 0);

const inputHandler = () => {
  zoom.value = Number(zoom.value);
  emit('update:modelValue', zoom.value);
}

watch(() => props.modelValue, (newValue) => {
  zoom.value = Number(newValue);
});
</script>

<style lang="scss">
  .zoom {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &__label {
      margin-right: 10px;
      flex: 0 1 auto;
    }

    &__input {
      flex: 1 0 auto;
    }
  }
</style>