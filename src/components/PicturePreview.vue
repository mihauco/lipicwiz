<template>
  <div
    class="picture-preview"
    @mousedown="mouseDownHandler"
    :style="`width: ${previewSize}px; height: ${previewSize}px`"
  >
    <div
      class="picture-preview__inner"
      :style="`
        width: ${renderSize}px;
        transform: scale(${previewSize / renderSize});
      `"
    >
      <svg
        :width="`${renderSize}px`"
        :height="`${renderSize}px`"
        :view-box="`0 0 ${renderSize} ${renderSize}`"
        ref="svg"
      >
        <defs>
          <svg:style type="text/css">{{ latoBase64CSS }}</svg:style>
          <clipPath id="clipImage">
            <circle
            :r="renderSize / 2"
            :cx="renderSize / 2"
            :cy="renderSize / 2"
            />
          </clipPath>
          <path
            id="textCircle"
            :d="`
              M ${renderSize / 2} ${renderSize / 2}
              m ${renderSize / 2} 0
              a ${renderSize / 2},${renderSize / 2} 0 1,0 -${renderSize},0
              a ${renderSize / 2},${renderSize / 2} 0 1,0 ${renderSize},0
            `"
            :transform="`rotate(-45 ${renderSize / 2} ${renderSize / 2})`"
          />
          <linearGradient id="circleGradient" x1="1" x2="0" y1="0" y2="1" gradientTransform="rotate(0)">
            <stop :offset="gradientOffset[0]" stop-color="black" stop-opacity="1"/>
            <stop :offset="gradientOffset[1]" stop-color="white" stop-opacity="1"/>
          </linearGradient>
          <mask id="hole">
            <rect
              :width="`${renderSize}px`"
              :height="`${renderSize}px`"
              fill="url(#circleGradient)"
            />
            <circle
              :r="Math.round(0.35 * renderSize)"
              :cx="renderSize / 2"
              :cy="renderSize / 2"
            />
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
          :r="renderSize / 2"
          :cx="renderSize / 2"
          :cy="renderSize / 2"
          :fill="backgroundColor"
          mask="url(#hole)"
        />
        <text :dy="`-${Math.round(0.04 * renderSize)}`" text-anchor="middle">
          <textPath
            xlink:href="#textCircle"
            startOffset="50%"
            :fill="textColor"
            font-family="LatoB64, Arial"
            font-weight="bold"
            :font-size="`${Math.round(0.1 * renderSize)}px`"
            :letter-spacing="`${Math.round(0.018 * renderSize)}px`"
          >
            {{ text }}
          </textPath>
        </text>
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import latoBase64CSS from '@/constants/latoBase64CSS';
import inlineSvgToBase64Png from '@/helpers/inlineSvgToBase64Png';
import getImageDimensionsFromBase64 from '@/helpers/getImageDimensionsFromBase64';
import { renderSize, previewSize } from '@/constants/imageSize';

const props = defineProps<{
  image: string
  text: string
  zoom: number
  textColor: string
  backgroundColor: string
}>();

const svg = ref<SVGElement | null>(null);
const imageSize = ref<{width: number, height: number}>({width: 0, height: 0});
const imageSvgPosition = ref<{x: number, y: number}>({x: 0, y: 0});
const isMouseDown = ref(false);
const lastMousePosition = ref<{x: number, y: number}>({x: 0, y: 0});

const imageHasSize = computed(() => {
  return imageSize.value.width !== 0 && imageSize.value.height !== 0;
})

const imageShorterSize = computed<keyof typeof imageSize.value>(() => {
  return imageSize.value.width < imageSize.value.height ? 'width' : 'height';
});

const minSvgImageWidth = computed(() => {
  if (!imageHasSize.value) return imageSize.value.width;
  if (imageShorterSize.value === 'width') return renderSize;

  return imageSize.value.width * (renderSize / imageSize.value.height);
})

const maxSvgImageWidth = computed(() => {
  if (!imageHasSize.value) return imageSize.value.width;

  if (imageShorterSize.value === 'width') {
    const deltaWidth = (renderSize + 100) - imageSize.value.width;
    if (deltaWidth > 0) return imageSize.value.width + deltaWidth;
    return imageSize.value.width;
  }

  const deltaHeight = (renderSize + 100) - imageSize.value.height;
  const scale = (imageSize.value.height + (deltaHeight > 0 ? deltaHeight : 0)) / imageSize.value.height;

  return imageSize.value.width * scale;
});

const minSvgImageHeight = computed(() => {
  if (!imageHasSize.value) return imageSize.value.height;
  if (imageShorterSize.value === 'height') return renderSize;

  return imageSize.value.height * (renderSize / imageSize.value.width);
});

const maxSvgImageHeight = computed(() => {
  if (!imageHasSize.value) return imageSize.value.height;

  if (imageShorterSize.value === 'height') {
    const deltaHeight = (renderSize + 100) - imageSize.value.height;
    if (deltaHeight > 0) return imageSize.value.height + deltaHeight;
    return imageSize.value.height;
  }

  const deltaWidth = (renderSize + 100) - imageSize.value.width;
  const scale = (imageSize.value.width + (deltaWidth > 0 ? deltaWidth : 0)) / imageSize.value.width;

  return imageSize.value.height * scale;
});

const imageSvgSize = computed(() => {
  return {
    width: minSvgImageWidth.value + (maxSvgImageWidth.value - minSvgImageWidth.value) * (props.zoom / 100),
    height: minSvgImageHeight.value + (maxSvgImageHeight.value - minSvgImageHeight.value) * (props.zoom / 100),
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
    
    const maxX = imageSvgSize.value.width - renderSize;
    const maxY = imageSvgSize.value.height - renderSize;

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

watch(() => imageSvgSize.value, (newSize, prevSize) => {
  if (!prevSize.width && !prevSize.height) {
    imageSvgPosition.value = {
      x: (renderSize - newSize.width) / 2,
      y: (renderSize - newSize.height) / 2,
    }
  } else {
    const newXPos = imageSvgPosition.value.x - ((newSize.width - prevSize.width) / 2);
    const newYPos = imageSvgPosition.value.y - ((newSize.height - prevSize.height) / 2);

    const maxX = imageSvgSize.value.width - renderSize;
    const maxY = imageSvgSize.value.height - renderSize;

    imageSvgPosition.value = {
      x: newXPos > 0
        ? 0
        : newXPos > -maxX ? newXPos : -maxX,
      y: newYPos > 0
        ? 0
        : newYPos > -maxY ? newYPos : -maxY,
    };
  }
});

getImageDimensionsFromBase64(props.image)
  .then(size => { imageSize.value = size });

defineExpose({ getPngImage });
</script>

<style lang="scss">
  .picture-preview {
    margin: 0 auto;
    overflow: hidden;
    position: relative;

    &__inner {
      transform-origin: top left;
    }

    svg {
      cursor: grab;
    }
  }
</style>