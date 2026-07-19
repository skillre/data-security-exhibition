export function Lighting() {
  return (
    <>
      {/* 环境光 - 提高基础亮度 */}
      <ambientLight intensity={0.5} color="#2a3a5a" />

      {/* 半球光 - 天空/地面填充 */}
      <hemisphereLight args={['#3a5a8a', '#1a1a2e', 0.6]} />

      {/* 主方向光 - 模拟天窗 */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.5}
        color="#6699ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />

      {/* 补充方向光 - 减少阴影死角 */}
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.5}
        color="#4466aa"
      />

      {/* 科技感点光源 - 入口大厅 */}
      <pointLight position={[0, 4, 0]} intensity={0.8} color="#4488ff" distance={20} decay={2} />

      {/* 科技感点光源 - 文档区方向 */}
      <pointLight position={[0, 3, -16]} intensity={0.6} color="#4488ff" distance={15} decay={2} />

      {/* 科技感点光源 - 海报区方向 */}
      <pointLight position={[-20, 3, 0]} intensity={0.6} color="#4488ff" distance={15} decay={2} />

      {/* 科技感点光源 - 视频区方向 */}
      <pointLight position={[20, 3, 0]} intensity={0.6} color="#4488ff" distance={15} decay={2} />

      {/* 科技感点光源 - 数据看板方向 */}
      <pointLight position={[0, 3, 16]} intensity={0.6} color="#4488ff" distance={15} decay={2} />
    </>
  );
}
