// 색상명과 HEX 코드 매핑 객체 추가
const colorNameToHex = {
  '빨강': '#ff0000',
  '레드': '#ff0000',
  '붉은색': '#d40000',
  '홍색': '#ff2400',
  
  '주황': '#ff7f00',
  '오렌지': '#ffa500',
  '등색': '#ff6600',
  
  '노랑': '#ffff00',
  '옐로우': '#ffff00',
  '황색': '#ffd700',
  
  '연두': '#adff2f',
  '라이트그린': '#90ee90',
  '연한초록': '#98fb98',
  
  '초록': '#008000',
  '그린': '#008000',
  '녹색': '#228b22',
  
  '청록': '#00ffff',
  '시안': '#00ffff',
  '에메랄드': '#50c878',

  '파랑': '#0000ff',
  '블루': '#0000ff',
  '푸른색': '#1e90ff',
  
  '남색': '#000080',
  '네이비': '#000080',
  '짙은파랑': '#002147',
  
  '보라': '#800080',
  '퍼플': '#800080',
  '자주색': '#6a0dad',
  
  '분홍': '#ff69b4',
  '핑크': '#ffc0cb',
  '연한홍색': '#ff6eb4',
  
  '갈색': '#a52a2a',
  '브라운': '#a52a2a',
  '밤색': '#8b4513',
  
  '회색': '#808080',
  '그레이': '#808080',
  '은색': '#c0c0c0',
  
  '검정': '#000000',
  '블랙': '#000000',
  '흑색': '#0b0b0b',
  
  '하양': '#ffffff',
  '화이트': '#ffffff',
  '흰색': '#f8f8ff',
  '하얀색': '#f5f5f5'
};
  // 필요에 따라 더 많은 색상명 추가
};

// 팔레트 생성 함수
function generatePalette() {
  const baseColor = document.getElementById('base-color').value;
  const paletteDiv = document.getElementById('palette');
  paletteDiv.innerHTML = ''; // 기존 팔레트 초기화

  // 밝기 조절한 색상 5개 생성
  for(let i = -2; i <= 2; i++) {
    const colorItem = document.createElement('div');
    colorItem.className = 'color-item';

    const colorBlock = document.createElement('div');
    colorBlock.className = 'color-block';

    const adjustedColor = adjustBrightness(baseColor, i * 20);
    colorBlock.style.backgroundColor = adjustedColor;

    const colorCode = document.createElement('span');
    colorCode.textContent = adjustedColor.toUpperCase();

    colorItem.appendChild(colorBlock);
    colorItem.appendChild(colorCode);
    paletteDiv.appendChild(colorItem);
  }
}

// 밝기 조절 함수
function adjustBrightness(hex, percent) {
  hex = hex.replace(/^\s*#|\s*$/g, '');
  if(hex.length == 3){
    hex = hex.replace(/(.)/g, '$1$1');
  }

  let r = parseInt(hex.substr(0,2),16);
  let g = parseInt(hex.substr(2,2),16);
  let b = parseInt(hex.substr(4,2),16);

  r = Math.min(255, Math.max(0, r + Math.round(255 * (percent / 100))));
  g = Math.min(255, Math.max(0, g + Math.round(255 * (percent / 100))));
  b = Math.min(255, Math.max(0, b + Math.round(255 * (percent / 100))));

  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// 이미지에서 색상 추출 기능 (기존 코드 유지)
const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('image-canvas');
const ctx = canvas.getContext('2d');
const selectedColorDiv = document.getElementById('selected-color');
const colorCodeP = document.getElementById('color-code');

fileInput.addEventListener('change', function(e){
  const file = e.target.files[0];
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.src = url;
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.style.display = 'block';
    ctx.drawImage(img, 0, 0);
  }
});

canvas.addEventListener('click', function(e){
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
  selectedColorDiv.style.backgroundColor = hex;
  colorCodeP.innerText = `선택한 색상 코드: ${hex.toUpperCase()}`;
});

// RGB를 HEX로 변환
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('');
}

// 스포이드 기능 구현 (기존 코드 유지)
document.getElementById('eyedropper-button').addEventListener('click', async () => {
  if ('EyeDropper' in window) {
    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      const color = result.sRGBHex;
      document.getElementById('eyedropper-color').style.backgroundColor = color;
      document.getElementById('eyedropper-code').innerText = `선택한 색상 코드: ${color.toUpperCase()}`;
    } catch (e) {
      console.error(e);
    }
  } else {
    alert('이 브라우저에서는 EyeDropper API를 지원하지 않습니다.');
  }
});

// 추천 색상 보기 버튼에 이벤트 리스너 추가
document.getElementById('recommend-button').addEventListener('click', recommendColors);

function recommendColors() {
  const inputElement = document.getElementById('color-input');
  const input = inputElement.value.trim();
  const colorsDiv = document.getElementById('recommended-colors');
  colorsDiv.innerHTML = '';

  let baseColor = '';

  // 색상명 처리 (입력값을 소문자로 변환하여 비교)
  const inputLower = input.toLowerCase();

  if (colorNameToHex[inputLower]) {
    baseColor = colorNameToHex[inputLower];
  } else if (/^#?[0-9A-Fa-f]{3}$/.test(input) || /^#?[0-9A-Fa-f]{6}$/.test(input)) {
    baseColor = input.startsWith('#') ? input : '#' + input;
  } else {
    alert('유효한 색상명이나 컬러 코드를 입력해주세요.');
    inputElement.focus();
    return;
  }

  // 추천 색상 조합 생성 (보색과 유사색)
  const recommendedColors = getRecommendedColors(baseColor);

  // 추천 색상 표시
  recommendedColors.forEach(color => {
    const colorItem = document.createElement('div');
    colorItem.className = 'color-item';

    const colorBlock = document.createElement('div');
    colorBlock.className = 'color-block';
    colorBlock.style.backgroundColor = color;

    const colorCode = document.createElement('span');
    colorCode.textContent = color.toUpperCase();

    colorItem.appendChild(colorBlock);
    colorItem.appendChild(colorCode);
    colorsDiv.appendChild(colorItem);
  });
}

// 추천 색상 조합 생성 함수 (기존 코드 유지)
function getRecommendedColors(hex) {
  // 보색과 유사색 2개를 반환
  const complementaryColor = getComplementaryColor(hex);
  const analogousColors = getAnalogousColors(hex);

  return [complementaryColor, ...analogousColors];
}

// 보색 계산 함수 (기존 코드 유지)
function getComplementaryColor(hex) {
  const hsl = hexToHSL(hex);
  let newHue = (hsl.h + 180) % 360;
  const newHSL = { h: newHue, s: hsl.s, l: hsl.l };
  return HSLToHex(newHSL);
}

// 유사색 계산 함수 (기존 코드 유지)
function getAnalogousColors(hex) {
  const hsl = hexToHSL(hex);
  const colors = [];

  // Hue를 ±30도씩 변경하여 유사색 생성
  for (let i of [-30, 30]) {
    let newHue = (hsl.h + i + 360) % 360;
    const newHSL = { h: newHue, s: hsl.s, l: hsl.l };
    colors.push(HSLToHex(newHSL));
  }
  return colors;
}

// HEX를 HSL로 변환하는 함수 (기존 코드 유지)
function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  H = H.replace('#', '');
  if (H.length == 3) {
    r = parseInt(H[0]+H[0],16);
    g = parseInt(H[1]+H[1],16);
    b = parseInt(H[2]+H[2],16);
  } else if (H.length == 6) {
    r = parseInt(H.substr(0,2),16);
    g = parseInt(H.substr(2,2),16);
    b = parseInt(H.substr(4,2),16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const cMin = Math.min(r,g,b);
  const cMax = Math.max(r,g,b);
  const delta = cMax - cMin;
  let h = 0, s = 0, l = 0;

  if (delta == 0)
    h = 0;
  else if (cMax == r)
    h = ((g - b) / delta) % 6;
  else if (cMax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  l = (cMax + cMin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

// HSL을 HEX로 변환하는 함수 (기존 코드 유지)
function HSLToHex(hsl) {
  let { h, s, l } = hsl;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c/2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  b = Math.round((b + m) * 255).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
}
