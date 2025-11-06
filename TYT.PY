import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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

const pointsData = [
  { position: [1, 0, 0], type: 'rest', hashtag: 'director' },
  { position: [0, 1, 0], type: 'learning', hashtag: 'developer' },
  // Добавь больше точек
];

function Globe() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="blue" wireframe={true} />
    </mesh>
  );
}

function Point({ position, type, hashtag, onClick }) {
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[0.01, 8, 8]} />
      <meshStandardMaterial color={colors[type]} />
    </mesh>
  );
}

function App() {
  const [filter, setFilter] = useState('');

  const filteredPoints = pointsData.filter(p => p.hashtag.includes(filter));

  const handlePointClick = (point) => {
    alert(`Раскрытие галактики для ${point.hashtag}`);
    // Логика падения и раскрытия галактики
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <input
        type="text"
        placeholder="Filter by hashtag, e.g. director"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Globe />
        <OrbitControls />
        {filteredPoints.map((p, i) => (
          <Point key={i} position={p.position} type={p.type} hashtag={p.hashtag} onClick={() => handlePointClick(p)} />
        ))}
      </Canvas>
    </div>
  );
}

export default App;
