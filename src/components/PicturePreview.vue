<template>
  <div
    class="picture-preview"
    @mousedown="mouseDownHandler"
  >
    <svg width="278px" height="278px" view-box="0 0 278 278" ref="svg">
      <defs>
        <svg:style type="text/css">{{ latoBase64CSS }}</svg:style>
        <clipPath id="clipImage">
          <circle r="139" cx="139" cy="139"/>
        </clipPath>
        <path
          id="textCircle"
          d="
            M 139 139
            m 139 0
            a 139,139 0 1,0 -278,0
            a 139,139 0 1,0 278,0
          "
          transform="rotate(-45 139 139)"
        />
        <linearGradient id="circleGradient" x1="1" x2="0" y1="0" y2="1" gradientTransform="rotate(0)">
          <stop :offset="gradientOffset[0]" stop-color="black" stop-opacity="1"/>
          <stop :offset="gradientOffset[1]" stop-color="white" stop-opacity="1"/>
        </linearGradient>
        <mask id="hole">
          <rect width="278px" height="278px" fill="url(#circleGradient)"/>
          <circle r="97" cx="139" cy="139"/>
        </mask>
      </defs>
      <image
        :width="`${imageSvgSize.width}px`"
        :height="`${imageSvgSize.height}px`"
        :x="`${imageSvgPosition.x}px`"
        :y="`${imageSvgPosition.y}px`"
        :xlink:href="image"
        clip-path="url(#clipImage)"
        preserveAspectRatio="xMidYMid slice"
      />
      <circle
        r="139"
        cx="139"
        cy="139"
        :fill="backgroundColor"
        mask="url(#hole)"
      />
      <text dy="-12" text-anchor="middle">
        <textPath
          xlink:href="#textCircle"
          startOffset="50%"
          :fill="textColor"
          font-family="LatoB64, Arial"
          font-weight="bold"
          font-size="28px"
          letter-spacing="5px"
        >
          {{ text }}
        </textPath>
      </text>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineExpose, ref, computed, watch } from 'vue';
import latoBase64CSS from '@/constants/latoBase64CSS';
import inlineSvgToBase64Png from '@/helpers/inlineSvgToBase64Png';
import getImageDimensionsFromBase64 from '@/helpers/getImageDimensionsFromBase64';

const props = defineProps<{
  image: string
  text: string
  textColor: string
  backgroundColor: string
}>();

const svg = ref<SVGElement | null>(null);
const imageSize = ref<{width: number, height: number}>({width: 0, height: 0});
const imageSvgPosition = ref<{x: number, y: number}>({x: 0, y: 0});
const isMouseDown = ref(false);
const lastMousePosition = ref<{x: number, y: number}>({x: 0, y: 0});

const imageSvgSize = computed(() => {
  if (imageSize.value.width === 0 || imageSize.value.height === 0) return imageSize.value;

  const shorterSide: keyof typeof imageSize.value = imageSize.value.width < imageSize.value.height 
    ? 'width' : 'height';
  
  const scale = (278 / imageSize.value[shorterSide]);

  return {
    width: shorterSide === 'width' ? 278 : imageSize.value.width * scale,
    height: shorterSide === 'height' ? 278 : imageSize.value.height * scale
  };
});

const gradientOffset = computed(() => {
  const textLenght = props.text.length;

  if (textLenght > 12) {
    return [
      `${55 - 2 * (textLenght - 12)}%`,
      `${65 - 2 * (textLenght - 12)}%`
    ];
  };

  return ['55%', '65%'];
});

const getPngImage = () => {
  return inlineSvgToBase64Png(svg.value as SVGElement);
}

const mouseDownHandler = (event: MouseEvent) => {
  isMouseDown.value = true;
  lastMousePosition.value = {
    x: event.clientX,
    y: event.clientY
  };

  document.body.addEventListener('mouseup', bodyMouseUpHandler);
  document.body.addEventListener('mousemove', bodyMouseMoveHandler);
}

const bodyMouseUpHandler = () => {
  isMouseDown.value = false;
  document.body.removeEventListener('mouseup', bodyMouseUpHandler);
  document.body.removeEventListener('mousemove', bodyMouseMoveHandler);
}

const bodyMouseMoveHandler = (event: MouseEvent) => {
  if (isMouseDown.value) {
    const deltaX = event.clientX - lastMousePosition.value.x;
    const deltaY = event.clientY - lastMousePosition.value.y;

    const newXPos = imageSvgPosition.value.x + deltaX;
    const newYPos = imageSvgPosition.value.y + deltaY;
    
    const maxX = imageSvgSize.value.width - 278;
    const maxY = imageSvgSize.value.height - 278;

    imageSvgPosition.value = {
      x: deltaX === 0
        ? imageSvgPosition.value.x
        : deltaX > 0
          ? newXPos < 0 ? newXPos : 0
          : newXPos > -maxX ? newXPos : -maxX,
      y: deltaY === 0
        ? imageSvgPosition.value.y
        : deltaY > 0
          ? newYPos < 0 ? newYPos : 0
          : newYPos > -maxY ? newYPos : -maxY
    };

    lastMousePosition.value = {
      x: event.clientX,
      y: event.clientY
    };
  }
}

watch(() => imageSvgSize.value, (newSize) => {
  imageSvgPosition.value = {
    x: (278 - newSize.width) / 2,
    y: (278 - newSize.height) / 2,
  }
});

getImageDimensionsFromBase64(props.image)
  .then(size => { imageSize.value = size });

defineExpose({ getPngImage });
</script>

<style lang="scss">
  .picture-preview {
    width: 278px;
    margin: 0 auto;

    svg {
      cursor: grab;
    }
  }
</style>