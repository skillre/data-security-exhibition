export function Lighting() {
  return (
    <>
      {/* 环境光 - 提供基础照明 */}
      <ambientLight intensity={0.6} />
      
      {/* 主方向光 - 模拟顶部灯光 */}
      <directionalLight
        position={[0, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* 补光 - 减少阴影过暗 */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.4}
      />
      
      {/* 点光源 - 展厅中央 */}
      <pointLight position={[0, 3.5, 0]} intensity={0.5} color="#4fc3f7" />
      
      {/* 展位聚光灯 */}
      <spotLight
        position={[-6, 3.5, -7]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.8}
        color="#ffffff"
        target-position={[-6, 1.5, -9]}
      />
      <spotLight
        position={[0, 3.5, -7]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.8}
        color="#ffffff"
      />
      <spotLight
        position={[6, 3.5, -7]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.8}
        color="#ffffff"
      />
      <spotLight
        position={[0, 3.5, 7]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.8}
        color="#ffffff"
      />
    </>
  );
}
