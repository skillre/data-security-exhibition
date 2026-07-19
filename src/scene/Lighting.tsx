export function Lighting() {
  return (
    <>
      {/* 环境光 - 基础照明 */}
      <ambientLight intensity={0.3} color="#1a2a4a" />

      {/* 半球光 - 天空/地面填充 */}
      <hemisphereLight args={['#1a3a6a', '#0a0a1a', 0.4]} />

      {/* 主方向光 - 模拟天窗 */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        color="#4488ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />

      {/* 科技感点光源 */}
      <pointLight position={[0, 4, 0]} intensity={0.5} color="#4488ff" distance={15} decay={2} />
      <pointLight position={[-10, 3, -10]} intensity={0.3} color="#2266cc" distance={12} decay={2} />
      <pointLight position={[10, 3, 10]} intensity={0.3} color="#2266cc" distance={12} decay={2} />
    </>
  );
}
