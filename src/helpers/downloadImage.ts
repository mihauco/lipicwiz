let a: HTMLAnchorElement;

const downloadImage = (name: string, base64image: string) => {
  if (!a) a = document.createElement('a');

  a.href = base64image;
  a.download = name;
  a.click();
}

export default downloadImage;