<template>
  <div class="text-input">
    <label class="text-input__label">{{ label }}:</label>
    <input class="text-input__input" v-model="text" @input="inputHandler">
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string
  label: string
}>()

const emit = defineEmits(['update:modelValue']);

const formatText = (text: string) => {
  return text
    .toUpperCase()
    .trim()
    .replace(/\s/g, '')
    .substring(0, 24);
}

const text = ref(formatText(props.modelValue));

const inputHandler = () => {
  text.value = formatText(text.value);
  emit('update:modelValue', text.value);
}

watch(() => props.modelValue, (newValue) => {
  text.value = newValue;
})
</script>

<style lang="scss">
  .text-input {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &__label {
      margin-right: 10px;
      flex: 0 1 auto;
    }

    &__input {
      flex: 1 0 auto;
      font-size: 16px;
      font-family: 'Lato', 'Arial', sans-serif;
      font-weight: bold;
      border: none;
      border-bottom: 1px solid #BFBFBF;
      background: none;

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
</style>