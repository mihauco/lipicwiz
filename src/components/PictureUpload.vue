<template>
  <div class="picture-upload">
    <div class="picture-upload__input-wrapper" @click="openFileDialog">
      <input
        class="picture-upload__input"
        type="file"
        ref="fileInput"
        accept="image/png,image/jpg,image/jpeg"
        @change="changeHandler"
      >
      <span class="picture-upload__plus">+</span>
      <span class="picture-upload__upload-text">Click to upload an image.</span>
    </div>
    <div v-if="showTypeError" class="picture-upload__error">
      Nope. Please upload png, jpg or jpeg file.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits(['upload']);
const fileInput = ref<null | HTMLInputElement>(null);
const showTypeError = ref(false);

const changeHandler = () => {
  if (fileInput.value && fileInput.value.files?.length) {
    const file = fileInput.value.files[0];

    if (file.type.match(/^image\/(png|jpg|jpeg)$/)) {
      showTypeError.value = false;
      const reader = new FileReader();

      reader.onload = () => {
        emit('upload', <string>reader.result);
      }
      
      reader.readAsDataURL(file);
    } else {
      showTypeError.value = true;
    }
  }
}

const openFileDialog = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};
</script>

<style lang="scss">
  .picture-upload {
    width: 278px;
    margin: 0 auto;

    &__input-wrapper {
      width: 278px;
      height: 278px;
      border-radius: 50%;
      background: #ddd;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    &__input {
      display: none;
    }

    &__plus {
      font-weight: bold;
      font-size: 32px;
    }

    &__error {
      margin-top: 10px;
      text-align: center;
      color: #ff0000;
    }
  }
</style>