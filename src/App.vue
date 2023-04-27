<template>
  <div class="app">
    <header class="app__header">
      <h1 class="app__headline">{{ meta.title }}</h1>
      <p class="app__description">
        {{ meta.description }}
      </p>
      <p class="app__info">
        This tool doesn't need any server side support to generate profile picture, so your image is not send anywhere, everything is done by your browser. Enjoy.
      </p>
    </header>
    <main>
      <PictureUpload
        v-if="!uploadedImage"
        class="app__picture-upload"
        @upload="uploadHandler"
      />
      <template v-else>
        <PicturePreview
          ref="picturePreview"
          class="app__picture-preview"
          :image="uploadedImage"
          :text="hashtag"
          :text-color="textColor"
          :background-color="backgroundColor"
        />
        <div class="app__picture-config">
          <TextInput
            class="app__text-input"
            v-model="text"
            label="Hashtag"
          />
          <ColorPicker
            class="app__color-picker app__color-picker--text-color"
            v-model="textColor"
            label="Text color"
          />
          <ColorPicker
            class="app__color-picker app__color-picker--background-color"
            v-model="backgroundColor"
            label="Stripe color"
          />
          <div class="app__buttons">
            <Button class="app__button app__button--change" @click="changeImage" secondary>Change Image</Button>
            <Button class="app__button app__button--download" @click="download">Download</Button>
          </div>
        </div>
      </template>
    </main>
    <footer class="app__footer">
      v{{ version }} | made by <a href="https://mihau.co" target="_blank">mihau</a>
    </footer>
    <Loader v-if="showLoader"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PictureUpload from '@/components/PictureUpload.vue';
import PicturePreview from '@/components/PicturePreview.vue';
import TextInput from '@/components/TextInput.vue';
import ColorPicker from '@/components/ColorPicker.vue';
import Button from '@/components/Button.vue';
import Loader from './components/Loader.vue';
import downloadImage from '@/helpers/downloadImage';
import meta from '@/constants/meta';
import dummyTexts from '@/constants/dummyTexts';
import { version } from '../package.json';

const initialData = dummyTexts[Math.round(Math.random() * (dummyTexts.length - 1))];

const uploadedImage = ref<null | string>(null);
const text = ref(initialData.text);
const textColor = ref(initialData.color);
const backgroundColor = ref(initialData.background);
const showLoader = ref(false);

const picturePreview = ref<InstanceType<typeof PicturePreview> | null>(null);

const hashtag = computed(() => {
  if (text.value) return `#${text.value}`;
  return '';
});

const uploadHandler = (img: string) => {
  uploadedImage.value = img;
};

const changeImage = () => {
  uploadedImage.value = null;
}

const download = async () => {
  if (picturePreview.value) {
    showLoader.value = true;
    const base64Png = await picturePreview.value.getPngImage();
    showLoader.value = false;
    downloadImage(`${(text.value || 'noname').toLocaleLowerCase()}.png`, base64Png);
  }
}
</script>

<style lang="scss">
.app {
  max-width: 440px;
  margin: 0 auto;
  padding: 30px 20px 50px;
  min-height: 100vh;
  position: relative;

  &__header {
    margin-bottom: 30px;
  }

  &__headline {
    margin: 0;
    text-align: center;
    font-size: 32px;
  }

  &__description {
    text-align: center;
    margin-bottom: 0;
    line-height: 1.3;
  }

  &__info {
    text-align: center;
    margin-bottom: 0;
    line-height: 1.3;
    font-size: 14px;
  }

  &__picture-config {
    background: #E8E8E8;
    padding: 20px;
    border-radius: 7px;
    margin-top: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  &__text-input {
    width: 100%;
    margin-bottom: 15px;
  }

  &__color-picker {
    margin-bottom: 15px;

    &--text-color {
      margin-right: 20px;
    }
  }

  &__buttons {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__button {
    margin: 0 10px;
  }

  &__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px 20px;
    text-align: center;
    font-size: 12px;

    a, a:visited, a:hover {
      color: #49516F;
    }
  }
}
</style>
