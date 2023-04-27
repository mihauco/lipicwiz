<template>
  <div class="color-picker">
    <label class="color-picker__label">{{ label }}:</label>
    <div
      class="color-picker__swatch"
      :style="`background-color: ${color}`"
    >
      <input
        class="color-picker__input"
        ref="input"
        type="color"
        v-model="color"
        @input="inputHandler"
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps<{
  modelValue: string,
  label: string
}>();

const emit = defineEmits(['update:modelValue']);

const color = ref(props.modelValue);
const input = ref<HTMLInputElement | null>(null);

const clickHandler = () => {
  if (input.value) {
    input.value.click();
  }
}

const inputHandler = () => {
  emit('update:modelValue', color.value);
};

watch(() => props.modelValue, (newValue) => {
  color.value = newValue;
});
</script>

<style lang="scss">
  .color-picker {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &__label {
      margin-right: 10px;
    }

    &__swatch {
      width: 22px;
      height: 22px;
      border: 1px solid #BFBFBF;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
    }

    &__input {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
</style>