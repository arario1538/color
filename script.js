// 색상명과 HEX 코드 매핑 객체
const colorNameToHex = {
  '빨강': '#FF0000',
  '레드': '#FF0000',
  '붉은색': '#D40000',
  '홍색': '#FF2400',
  
  '주황': '#FF7F00',
  '오렌지': '#FFA500',
  '등색': '#FF6600',
  
  '노랑': '#FFFF00',
  '옐로우': '#FFFF00',
  '황색': '#FFD700',
  
  '연두': '#ADFF2F',
  '라이트그린': '#90EE90',
  '연한초록': '#98FB98',
  
  '초록': '#008000',
  '그린': '#008000',
  '녹색': '#228B22',
  
  '청록': '#00FFFF',
  '시안': '#00FFFF',
  '에메랄드': '#50C878',
  
  '파랑': '#0000FF',
  '블루': '#0000FF',
  '푸른색': '#1E90FF',
  
  '남색': '#000080',
  '네이비': '#000080',
  '짙은파랑': '#002147',
  
  '보라': '#800080',
  '퍼플': '#800080',
  '자주색': '#6A0DAD',
  
  '분홍': '#FF69B4',
  '핑크': '#FFC0CB',
  '연한홍색': '#FF6EB4',
  
  '갈색': '#A52A2A',
  '브라운': '#A52A2A',
  '밤색': '#8B4513',
  
  '회색': '#808080',
  '그레이': '#808080',
  '은색': '#C0C0C0',
  
  '검정': '#000000',
  '블랙': '#000000',
  '흑색': '#0B0B0B',
  
  '하양': '#FFFFFF',
  '화이트': '#FFFFFF',
  '흰색': '#F8F8FF',
  '하얀색': '#F5F5F5'
};

// HEX 코드로 색상명 찾기
function hexToColorNames(hex) {
  hex = hex.toUpperCase();
  const names = [];
  for (let [name, code] of Object.entries(colorNameToHex)) {
    if (code.toUpperCase() === hex) {
      names.push(name);
    }
  }
  return names;
}

// 팔레트 생성 함수
function generatePalette() {
  const paletteDiv = document.getElementById('palette');
  paletteDiv.innerHTML = ''; // 기존 팔레트 초기화

  // 색상명 목록에서 고유한 HEX 코드 목록 생성
  const uniqueColors = {};
  for (let [name, hex] of Object.entries(colorNameToHex)) {
    uniqueColors[hex.toUpperCase()] = true;
  }
  const hexCodes = Object.keys(uniqueColors);

  // 무작위로 12개의 색상 선택
  const selectedHexCodes = [];
  while (selectedHexCodes.length < 12 && hexCodes.length > 0) {
    const randomIndex = Math.floor(Math.random() * hexCodes.length);
    selectedHexCodes.push(hexCodes.splice(randomIndex, 1)[0]);
  }

  // 선택된 색상들로 팔레트 생성
  selectedHexCodes.forEach(hex => {
    const colorItem = document.createElement('div');
    colorItem.className = 'color-item';

    const colorBlock = document.createElement('div');
    colorBlock.className = 'color-block';
    colorBlock.style.backgroundColor = hex;

    const colorCode = document.createElement('span');
    colorCode.className = 'color-code';
    colorCode.textContent = hex;

    const colorNames = hexToColorNames(hex);
    const colorName = document.createElement('span');
    colorName.className = 'color-name';
    colorName.textContent = colorNames.join(', ');

    // 색상 클릭 시 헥사코드 복사 기능 추가
    colorItem.addEventListener('click', () => {
      copyToClipboard(hex);
    });

    colorItem.appendChild(colorBlock);
    colorItem.appendChild(colorCode);
    if (colorName.textContent) {
      colorItem.appendChild(colorName);
    }
    paletteDiv.appendChild(colorItem);
  });
}

// 색상 코드 복사 함수
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert(`클립보드에 복사되었습니다: ${text}`);
  }).catch(err => {
    alert('복사에 실패하였습니다.');
  });
}

// 이벤트 리스너 추가
document.getElementById('generate-palette-button').addEventListener('click', generatePalette);
