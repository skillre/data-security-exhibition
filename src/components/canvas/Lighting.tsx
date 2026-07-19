export function Lighting() {
  return (
    <>
      {/* 强环境光 - 模拟白天室外 */}
      <ambientLight intensity={1.2} />
      
      {/* 主方向光 - 模拟太阳 */}
      <directionalLight
        position={[5, 15, 5]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        color="#ffffff"
      />
      
      {/* 补光 - 减少阴影 */}
      <directionalLight
        position={[-5, 10, -5]}
        intensity={1.5}
        color="#f5f5ff"
      />
      
      {/* 顶部补光 */}
      <directionalLight
        position={[0, 15, 0]}
        intensity={1.0}
        color="#ffffff"
      />
      
      {/* 前方补光 */}
      <directionalLight
        position={[0, 5, 10]}
        intensity={0.8}
        color="#f0f0ff"
      />
      
      {/* 半球光 - 模拟天空散射 */}
      <hemisphereLight
        args={['#87ceeb', '#f0f0f0', 0.8]}
      />
    </>
  );
}
