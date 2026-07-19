export function Lighting() {
  return (
    <>
      {/* 环境光 - 大幅提高基础亮度 */}
      <ambientLight intensity={1.0} color="#3a4a6a" />

      {/* 半球光 - 天空/地面填充 */}
      <hemisphereLight args={['#5a7aaa', '#2a2a3e', 1.0]} />

      {/* 主方向光 */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={2.0}
        color="#88aaff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />

      {/* 补充方向光 */}
      <directionalLight
        position={[-10, 10, -10]}
        intensity={1.0}
        color="#6688cc"
      />

      {/* 各区域点光源 - 更亮 */}
      <pointLight position={[0, 4, 0]} intensity={1.5} color="#6699ff" distance={25} decay={2} />
      <pointLight position={[0, 3, -16]} intensity={1.2} color="#6699ff" distance={20} decay={2} />
      <pointLight position={[-20, 3, 0]} intensity={1.2} color="#6699ff" distance={20} decay={2} />
      <pointLight position={[20, 3, 0]} intensity={1.2} color="#6699ff" distance={20} decay={2} />
      <pointLight position={[0, 3, 16]} intensity={1.2} color="#6699ff" distance={20} decay={2} />

      {/* 额外的环境光提升 */}
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" distance={40} decay={1} />
    </>
  );
}
