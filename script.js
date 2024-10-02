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

// 팔레트 생성 함수
function generatePalette() {
  const baseColor = document.getElementById('base-color').value;
  const paletteDiv = document.getElementById('palette');
  paletteDiv.innerHTML = ''; // 기존 팔레트 초기화
  // 단순히 밝기 조절한 색상 5개 생성
  for(let i = 1; i <= 5; i++) {
    const colorDiv = document.createElement('div');
    const adjustedColor = adjustBrightness(baseColor, i * 20);
    colorDiv.style.backgroundColor = adjustedColor;
    paletteDiv.appendChild(colorDiv);
  }
}
// 밝기 조절 함수
function adjustBrightness(hex, percent) {
  hex = hex.replace(/^\s*#|\s*$/g, '');
  if(hex.length == 3){
    hex = hex.replace(/(.)/g, '$1$1');
  }
  var r = parseInt(hex.substr(0,2),16);
  var g = parseInt(hex.substr(2,2),16);
  var b = parseInt(hex.substr(4,2),16);
  return '#' +
   ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
   ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
   ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}
// 이미지에서 색상 추출 기능
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
  const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
  const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
  selectedColorDiv.style.backgroundColor = hex;
  colorCodeP.innerText = `선택한 색상 코드: ${hex}`;
});
// RGB를 HEX로 변환
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('');
}
// 색상 추천 기능
function recommendColors() {
  const input = document.getElementById('color-input').value.trim();
  const colorsDiv = document.getElementById('recommended-colors');
  colorsDiv.innerHTML = '';
  let baseColor = '';
  // 색상명이 입력된 경우 처리 (간단히 빨강, 초록, 파랑만 처리)
  if (input === '빨강') baseColor = '#ff0000';
  else if (input === '초록') baseColor = '#00ff00';
  else if (input === '파랑') baseColor = '#0000ff';
  else if (/^#?[0-9A-Fa-f]{6}$/.test(input)) {
    baseColor = input.startsWith('#') ? input : '#' + input;
  } else {
    alert('유효한 색상명이나 컬러 코드를 입력해주세요.');
    return;
  }
  // 보색 계산 (단순히 Hue를 180도 회전)
  const complementaryColor = getComplementaryColor(baseColor);
  const colorDiv = document.createElement('div');
  colorDiv.style.backgroundColor = complementaryColor;
  colorDiv.style.width = '100px';
  colorDiv.style.height = '100px';
  colorsDiv.appendChild(colorDiv);
}
// 보색 계산 함수
function getComplementaryColor(hex) {
  hex = hex.replace(/^\s*#|\s*$/g, '');
  var r = parseInt(hex.substr(0,2),16);
  var g = parseInt(hex.substr(2,2),16);
  var b = parseInt(hex.substr(4,2),16);
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  return '#' + padZero(r) + padZero(g) + padZero(b);
}
function padZero(str) {
  return str.length === 1 ? '0' + str : str;
}
// 스포이드 기능 구현
document.getElementById('eyedropper-button').addEventListener('click', async () => {
  if ('EyeDropper' in window) {
    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      const color = result.sRGBHex;
      document.getElementById('eyedropper-color').style.backgroundColor = color;
      document.getElementById('eyedropper-code').innerText = `선택한 색상 코드: ${color}`;
    } catch (e) {
      console.error(e);
    }
  } else {
    alert('이 브라우저에서는 EyeDropper API를 지원하지 않습니다.');
  }
});
