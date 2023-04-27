let canvas: HTMLCanvasElement, img: HTMLImageElement; 

const inlineSvgToBase64Png = (svg: SVGElement): Promise<string> => {
  if (!canvas) canvas = document.createElement('canvas');
  if (!img) img = document.createElement('img');

  const svgBase64 = `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(svg))}`;
  const ctx = canvas.getContext('2d')!;

  return new Promise(resolve => {
    const imgLoadHandler = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      setTimeout(() => {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png') as string);
        img.removeEventListener('load', imgLoadHandler);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 100);
    }

    img.addEventListener('load', imgLoadHandler);
    img.src = svgBase64;
  });
}

export default inlineSvgToBase64Png;