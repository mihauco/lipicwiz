let img: HTMLImageElement;

const getImageDimensionsFromBase64 = (base64Image: string): Promise<{width: number, height: number}> => {
  if (!img) img = document.createElement('img');

  return new Promise(resolve => {
    const imgLoadHandler = () => {
      resolve({
        width: img.width,
        height: img.height
      });

      img.removeEventListener('load', imgLoadHandler);
    }

    img.addEventListener('load', imgLoadHandler);
    img.src = base64Image;
  });
}

export default getImageDimensionsFromBase64