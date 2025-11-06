import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TextureLoader } from '@react-three/drei';
import * as THREE from 'three';

const colors = {
  rest: 0x0000FF, // голубой - покой
  learning: 0x00FF00, // зеленый - обучение
  creativity: 0xFF00FF, // фиолетовый - творчество
  organization: 0xFF0000, // красный - организация
  attendance: 0xFFA500, // оранжевый - посещение
  intention: 0xFFFF00, // желтый - намерение
  travel: 0x00008B, // синий - путешествие
};

// Функция для конвертации географических координат (широта, долгота) в 3D-координаты на сфере r=1
// lat: [-90, 90] (широта), lon: [-180, 180] (долгота)
function latLonToCartesian(lat, lon, radius = 1) {
  const latRad = lat * (Math.PI / 180);
  const lonRad = -lon * (Math.PI / 180); // Инвертируем долготу для правильного направления вращения в Three.js
  
  // Координаты на сфере
  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.sin(lonRad);
  
  return [x, y, z];
}

// 16 точек на глобусе (примерные локации для разнообразия)
const pointsData = [
  // 1. Исходные
  { position: latLonToCartesian(0, 0), type: 'rest', hashtag: 'director' }, // Экватор, Гринвич
  { position: latLonToCartesian(40, -100), type: 'learning', hashtag: 'developer' }, // Северная Америка
  { position: latLonToCartesian(50, 10), type: 'creativity', hashtag: 'artist' }, // Европа
  
  // 4. Добавленные 13 точек для 16 всего
  { position: latLonToCartesian(-30, 30), type: 'organization', hashtag: 'manager' }, // Африка
  { position: latLonToCartesian(20, 80), type: 'attendance', hashtag: 'speaker' }, // Азия
  { position: latLonToCartesian(-20, -60), type: 'intention', hashtag: 'visionary' }, // Южная Америка
  { position: latLonToCartesian(-40, 140), type: 'travel', hashtag: 'explorer' }, // Австралия/Океания
  
  { position: latLonToCartesian(60, -150), type: 'rest', hashtag: 'sleeper' }, // Сев. Тихий океан
  { position: latLonToCartesian(-5, 120), type: 'learning', hashtag: 'student' }, // Индонезия
  { position: latLonToCartesian(55, -4), type: 'creativity', hashtag: 'writer' }, // Великобритания
  { position: latLonToCartesian(35, 135), type: 'organization', hashtag: 'planner' }, // Япония
  
  { position: latLonToCartesian(-60, 50), type: 'attendance', hashtag: 'participant' }, // Южный океан
  { position: latLonToCartesian(10, -80), type: 'intention', hashtag: 'goalsetter' }, // Центральная Америка
  { position: latLonToCartesian(30, 0), type: 'travel', hashtag: 'backpacker' }, // Средиземноморье
  { position: latLonToCartesian(-70, -160), type: 'rest', hashtag: 'meditator' }, // Антарктика
  { position: latLonToCartesian(45, 15), type: 'learning', hashtag: 'professor' }, // Балканы
  { position: latLonToCartesian(15, 45), type: 'creativity', hashtag: 'designer' }, // Ближний Восток
];

function Globe() {
  const texture = new THREE.TextureLoader().load('/assets/earth.jpg');
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function Point({ position, type, hashtag, onClick }) {
  // Координаты уже на поверхности сферы, поэтому дополнительной логики не нужно
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[0.01, 8, 8]} />
      <meshStandardMaterial color={new THREE.Color(colors[type])} />
    </mesh>
  );
}

function App() {
  const [filter, setFilter] = useState('');
  const [showLegend, setShowLegend] = useState(true);

  // Сортировка по хэштегу
  const filteredPoints = pointsData.filter(p => p.hashtag.toLowerCase().includes(filter.toLowerCase()));

  const handlePointClick = (point) => {
    alert(`Раскрытие галактики для ${point.hashtag}. Тип: ${point.type}`);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        <input
          type="text"
          placeholder="Filter by hashtag, e.g. director"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      
      {showLegend && (
        <div style={{ position: 'absolute', top: 60, left: 10, zIndex: 10, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Легенда типов:</p>
          {Object.keys(colors).map(type => (
              <button 
                  key={type}
                  style={{ 
                      backgroundColor: `#${colors[type].toString(16).padStart(6, '0')}`, 
                      color: 'white', 
                      marginRight: '5px', 
                      marginBottom: '5px', 
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '3px',
                      cursor: 'default'
                  }}
              >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
          ))}
          <button 
            onClick={() => setShowLegend(false)}
            style={{ 
                marginTop: '10px', 
                backgroundColor: '#f44336', 
                color: 'white', 
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer'
            }}
          >
              Скрыть легенду
          </button>
        </div>
      )}
      
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Globe />
        {/* OrbitControls по умолчанию активирует вращение, зум и панорамирование 
            через мышь/тач, что соответствует требованию "вращай глобус тачем" */}
        <OrbitControls enableRotate={true} enableZoom={true} enablePan={true} />
        
        {filteredPoints.map((p, i) => (
          <Point key={i} position={p.position} type={p.type} hashtag={p.hashtag} onClick={() => handlePointClick(p)} />
        ))}
      </Canvas>
    </div>
  );
}

export default App;
